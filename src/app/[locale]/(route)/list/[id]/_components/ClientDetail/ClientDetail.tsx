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
import type { PostDetailData } from "@/api/fetch/post/types/PostDetailType";
import { DetailHeaderPlaceholder, DetailSkeleton, ErrorSimilarSection } from "../_internal";
import { useHandleReplySubmit } from "../../_hooks/useHandleReplySubmit/useHandleReplySubmit";
import { useToggleCommentLike } from "../../_hooks/usePostCommentLike/usePostCommentLike";
import ManualPopup from "@/app/[locale]/(route)/manual/_components/ManualPopup/ManualPopup";

interface ClientDetailProps {
  id: number;
  isLoggedIn: boolean;
  /**
   * 서버에서 익명으로 조회한 게시글 본문입니다. 있으면 본문을 바로 그려 초기 HTML에 싣습니다.
   * 사용자별 값(`isMine`, `favoriteStatus`)은 비어 있으므로 클라이언트 조회 결과가 오면 그 값으로 대체합니다.
   * 서버 조회가 실패하면 비어 있고, 이때는 기존처럼 클라이언트 조회가 끝날 때까지 스켈레톤을 보여줍니다.
   */
  initialPost?: PostDetailData;
}

const ClientDetail = ({ id, isLoggedIn, initialPost }: ClientDetailProps) => {
  const t = useTranslations("ClientDetail");
  const locale = useLocale();
  const { addToast } = useToast();
  const { showPrompt, incrementViewCount, closePrompt } = useAddToHomeScreen();
  const { showManualPopup, setShowManualPopup } = useWriteFlowStore();

  const { data, isLoading, isError } = useGetDetailPost({ id });
  const { data: preferredLanguageData, isLoading: isPreferredLanguageLoading } =
    useGetPreferredLanguage(isLoggedIn);
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

  // 서버 데이터는 React Query 캐시에 넣지 않고 props로만 받는다. 클라이언트 조회 결과가 있으면 그것을,
  // 없으면 서버 데이터를 쓴다. 로그인 흐름에서 캐시가 비워져도 본문은 서버 데이터로 남아 흔들리지 않는다.
  const livePost = data?.result;
  const post = livePost ?? initialPost;
  const isTranslationPending =
    (locale === "en" && isLoggedIn && isPreferredLanguageLoading) ||
    (shouldTranslate && isTranslationLoading);
  // 서버 데이터가 있으면 번역을 기다리는 동안에도 원문을 그대로 보여준다. 스켈레톤으로 바꾸면 서버 HTML의
  // 본문이 사라졌다가 다시 나타난다.
  const shouldShowSkeleton = !initialPost && (isLoading || isError || isTranslationPending);
  const isErrorState = !isLoading && (isError || !data?.result);

  if (!post || shouldShowSkeleton) {
    return (
      <>
        <ManualPopup isOpen={showManualPopup} onClose={() => setShowManualPopup(false)} />
        <DetailSkeleton isError={isErrorState} />
      </>
    );
  }

  const translatedPost = shouldTranslate ? translationData?.result : undefined;
  const postDetailData = translatedPost
    ? {
        ...post,
        title: translatedPost.translatedTitle || post.title,
        content: translatedPost.translatedContent || post.content,
      }
    : post;
  const similarTitle = post.postType === "LOST" ? t("similarReportTitle") : t("similarLostTitle");

  return (
    <>
      <ManualPopup isOpen={showManualPopup} onClose={() => setShowManualPopup(false)} />
      {/* 즐겨찾기·메뉴는 사용자별 값이 필요해 클라이언트 조회가 끝난 뒤에만 실제 헤더를 붙인다. */}
      {livePost ? (
        <PostDetailTopHeader
          postId={id}
          postData={{
            isMine: livePost.isMine,
            writerId: livePost.postUserInformation.userId,
            favoriteStatus: livePost.favoriteStatus,
            postStatus: livePost.postStatus,
          }}
        />
      ) : (
        <DetailHeaderPlaceholder />
      )}

      <h1 className="sr-only">
        {t("detailPageTitle", { title: postDetailData.title || t("defaultTitle") })}
      </h1>

      <article className="flex flex-col h-base">
        <PostDetail data={postDetailData} />

        {/* 댓글·유사 게시글·댓글 입력은 색인 대상이 아니고 인증 상태에 기대므로, 기존과 같이
            클라이언트 조회가 끝난 뒤에 렌더한다. */}
        {livePost && (
          <>
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
          </>
        )}
      </article>

      <AddToHomeScreenPWA isOpen={showPrompt} onClose={closePrompt} />
    </>
  );
};

export default ClientDetail;
