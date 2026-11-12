"use client";

import { CommentList } from "@/components";
import { NoticeCommentForm, NoticeDetailContent, NoticeDetailSkeleton } from "./_internal";
import { useGetNoticeDetail } from "@/api/fetch/notice";
import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "@/i18n/navigation";
import { useGetUsersMe } from "@/api/fetch/user";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteNoticeComment,
  useGetNoticeComment,
  useGetRepliesNoticeComment,
} from "@/api/fetch/noticeComment";
import { DeleteCommentVariables } from "@/api/fetch/comment";
import { useHandleNoticeReplySubmit } from "../../_hooks/useHandleNoticeReplySubmit/useHandleNoticeReplySubmit";
import { useToggleNoticeCommentLike } from "../../_hooks/useToggleNoticeCommentLike/useToggleNoticeCommentLike";
import { useTranslations } from "next-intl";
import type { NoticeDetail } from "@/api/fetch/notice/types/NoticeDetailType";

interface NoticeDetailViewProps {
  id: number;
  /**
   * 서버에서 익명으로 조회한 공지 본문입니다. 있으면 본문을 바로 그려 초기 HTML에 싣습니다.
   * `likeStatus`는 익명 기준 값이라 클라이언트 조회 결과가 오면 그 값으로 대체합니다.
   * 서버 조회가 실패하면 비어 있고, 이때는 기존처럼 클라이언트 조회가 끝날 때까지 스켈레톤을 보여줍니다.
   */
  initialNotice?: NoticeDetail;
}

const NoticeDetailView = ({ id, initialNotice }: NoticeDetailViewProps) => {
  const t = useTranslations("NoticePage.detail");
  const { data: noticeDetail, isLoading, isError } = useGetNoticeDetail({ id });
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userData } = useGetUsersMe();
  const isLoggedIn = !!userData?.result;

  const { data: noticeComments, fetchNextPage } = useGetNoticeComment({ noticeId: id });

  const { mutate: deleteNoticeComment } = useDeleteNoticeComment();
  const { handleToggleFavorite } = useToggleNoticeCommentLike(id);
  const { handleReplySubmit, isPending } = useHandleNoticeReplySubmit(id);

  useEffect(() => {
    if (isError) {
      addToast(t("loadError"), "error");
      router.replace("/notice");
    }
  }, [isError, addToast, router, t]);

  const handleDeleteComment = ({ commentId, queryKey }: DeleteCommentVariables) => {
    const firstKey = Array.isArray(queryKey) ? queryKey[0] : undefined;
    const parentCommentId =
      Array.isArray(queryKey) && typeof queryKey[1] === "number" ? queryKey[1] : undefined;
    const invalidateQueryKey =
      firstKey === "replies-post-comments"
        ? ["replies-notice-comments", parentCommentId ?? commentId]
        : ["notice-comments", id];

    deleteNoticeComment(
      { commentId, queryKey: invalidateQueryKey },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notice-comments", id] });
        },
      }
    );
  };

  const handleFavoriteComment = (commentId: number, isLike: boolean, queryKey: unknown[]) => {
    const firstKey = Array.isArray(queryKey) ? queryKey[0] : undefined;
    const parentCommentId =
      Array.isArray(queryKey) && typeof queryKey[1] === "number" ? queryKey[1] : undefined;
    const mappedQueryKey =
      firstKey === "replies-post-comments"
        ? ["replies-notice-comments", parentCommentId ?? commentId]
        : ["notice-comments", id];

    handleToggleFavorite({ commentId, isLike, queryKey: mappedQueryKey });
  };

  // 서버 데이터는 React Query 캐시에 넣지 않고 props로만 받는다. 클라이언트 조회 결과가 있으면 그것을,
  // 없으면 서버 데이터를 쓴다. 로그인 흐름에서 캐시가 비워져도 본문은 서버 데이터로 남는다.
  const liveNotice = noticeDetail?.result;
  const notice = liveNotice ?? initialNotice;

  return (
    <div className="flex flex-col h-base">
      {!notice && isLoading && <NoticeDetailSkeleton />}
      {notice && (
        <NoticeDetailContent
          noticeDetail={notice}
          isLoggedIn={isLoggedIn}
          isPersonalized={Boolean(liveNotice)}
        />
      )}
      <CommentList
        postId={id}
        onSubmit={handleReplySubmit}
        isPending={isPending}
        isLoggedIn={isLoggedIn}
        comments={noticeComments}
        useFetchReplies={useGetRepliesNoticeComment}
        onCommentLoadMore={() => fetchNextPage()}
        onDeleteComment={handleDeleteComment}
        onFavoriteComment={handleFavoriteComment}
      />
      <NoticeCommentForm noticeId={id} isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default NoticeDetailView;
