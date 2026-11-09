"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import { useAddToHomeScreen } from "@/hooks";
import { useWriteFlowStore } from "@/store";
import { CommentList, AddToHomeScreenPWA } from "@/components";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useGetDetailPost, useGetPostTranslation } from "@/api/fetch/post";
import { useGetPreferredLanguage } from "@/api/fetch/user";
import {
  useDeleteComment,
  useGetPostsComments,
  useGetRepliesPostsComments,
} from "@/api/fetch/comment";
import PostDetail from "../PostDetail/PostDetail";
import PostDetailTopHeader from "../PostDetailTopHeader/PostDetailTopHeader";
import SimilarItemsSection from "../SimilarItemsSection/SimilarItemsSection";
import PostInputComment from "../PostInputComment/PostInputComment";
import { DetailSkeleton, ErrorSimilarSection } from "../_internal";
import { useHandleReplySubmit } from "../../_hooks/useHandleReplySubmit/useHandleReplySubmit";
import { useToggleCommentLike } from "../../_hooks/usePostCommentLike/usePostCommentLike";
import ManualPopup from "@/app/[locale]/(route)/manual/_components/ManualPopup/ManualPopup";

interface ClientDetailProps {
  id: number;
  isLoggedIn: boolean;
}

const ClientDetail = ({ id, isLoggedIn }: ClientDetailProps) => {
  const t = useTranslations("ClientDetail");
  const locale = useLocale();
  const { addToast } = useToast();
  const { showPrompt, incrementViewCount, closePrompt } = useAddToHomeScreen();
  const { showManualPopup, setShowManualPopup } = useWriteFlowStore();

  const { data, isLoading, isError } = useGetDetailPost({ id });
  // 번역 선호 언어는 영어 로케일에서만 사용한다. 한국어 로그인 사용자에게까지 조회하면 쓰지도 않을
  // 인증 요청이 나가고, 그 요청이 실패하면 세션 종료로 이어져 캐시가 비워지며 상세 트리가 스켈레톤과
  // 본문 사이를 반복 리마운트한다. 실제 필요한 조건으로 좁혀 이 churn을 원천 차단한다.
  const { data: preferredLanguageData, isLoading: isPreferredLanguageLoading } =
    useGetPreferredLanguage(isLoggedIn && locale === "en");
  const shouldTranslate =
    locale === "en" && preferredLanguageData?.result.preferredLanguage === "EN";
  const { data: translationData, isLoading: isTranslationLoading } = useGetPostTranslation({
    postId: id,
    enabled: shouldTranslate,
  });
  const { data: commentsData, fetchNextPage } = useGetPostsComments({ postId: id });
  const { handleReplySubmit, isPending } = useHandleReplySubmit(id);
  const { mutate: deleteComment } = useDeleteComment();
  const { handleToggleFavorite } = useToggleCommentLike();

  useEffect(() => {
    if (isError) {
      addToast(t("loadFailedToast"), "error");
    }
  }, [isError, addToast, t]);

  useEffect(() => {
    if (!isLoading && data?.result) {
      incrementViewCount();
    }
  }, [isLoading, data, incrementViewCount]);

  useEffect(() => {
    if (sessionStorage.getItem("showManualPopup") === "true") {
      setShowManualPopup(true);
      sessionStorage.removeItem("showManualPopup");
    }
  }, [setShowManualPopup]);

  const shouldShowSkeleton =
    isLoading ||
    isError ||
    !data?.result ||
    (locale === "en" && isLoggedIn && isPreferredLanguageLoading) ||
    (shouldTranslate && isTranslationLoading);
  const isErrorState = !isLoading && (isError || !data?.result);

  if (shouldShowSkeleton) {
    return (
      <>
        <ManualPopup isOpen={showManualPopup} onClose={() => setShowManualPopup(false)} />
        <DetailSkeleton isError={isErrorState} />
      </>
    );
  }

  const { isMine, postUserInformation } = data.result;
  const translatedPost = shouldTranslate ? translationData?.result : undefined;
  const postDetailData = translatedPost
    ? {
        ...data.result,
        title: translatedPost.translatedTitle || data.result.title,
        content: translatedPost.translatedContent || data.result.content,
      }
    : data.result;
  const similarTitle =
    data.result.postType === "LOST" ? t("similarReportTitle") : t("similarLostTitle");

  return (
    <>
      <ManualPopup isOpen={showManualPopup} onClose={() => setShowManualPopup(false)} />
      <PostDetailTopHeader
        postId={id}
        postData={{
          isMine,
          writerId: postUserInformation.userId,
          favoriteStatus: data.result.favoriteStatus,
          postStatus: data.result.postStatus,
        }}
      />

      <h1 className="sr-only">
        {t("detailPageTitle", { title: postDetailData.title || t("defaultTitle") })}
      </h1>

      <article className="flex flex-col h-base">
        <PostDetail data={postDetailData} />

        <CommentList
          postId={id}
          comments={commentsData}
          onSubmit={handleReplySubmit}
          isPending={isPending}
          isLoggedIn={isLoggedIn}
          useFetchReplies={useGetRepliesPostsComments}
          onDeleteComment={deleteComment}
          onFavoriteComment={(commentId, isLike, queryKey) =>
            handleToggleFavorite({ commentId, isLike, queryKey })
          }
          onCommentLoadMore={() => fetchNextPage()}
        />

        <ErrorBoundary fallback={<ErrorSimilarSection postId={id} title={similarTitle} />}>
          <SimilarItemsSection postId={id} title={similarTitle} />
        </ErrorBoundary>

        <PostInputComment postId={id} isLoggedIn={isLoggedIn} />
      </article>

      <AddToHomeScreenPWA isOpen={showPrompt} onClose={closePrompt} />
    </>
  );
};

export default ClientDetail;
