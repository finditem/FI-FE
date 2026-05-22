"use client";

import { CommentList } from "@/components";
import { NoticeCommentForm, NoticeDetailContent, NoticeDetailSkeleton } from "./_internal";
import { useGetNoticeDetail } from "@/api/fetch/notice";
import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
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

const NoticeDetailView = ({ id }: { id: number }) => {
  const { data: noticeDetail, isLoading, isError } = useGetNoticeDetail({ id });
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userData } = useGetUsersMe();
  const isLoggedIn = !!userData?.result;

  const { data: noticeComments, fetchNextPage } = useGetNoticeComment({
    noticeId: id,
    enabled: isLoggedIn,
  });

  const { mutate: deleteNoticeComment } = useDeleteNoticeComment();
  const { handleToggleFavorite } = useToggleNoticeCommentLike(id);
  const { handleReplySubmit, isPending } = useHandleNoticeReplySubmit(id);

  useEffect(() => {
    if (isError) {
      addToast("공지사항 불러오기에 실패했어요", "error");
      router.replace("/notice");
    }
  }, [isError]);

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

  return (
    <div className="flex flex-col h-base">
      {isLoading && <NoticeDetailSkeleton />}
      {noticeDetail && !isLoading && <NoticeDetailContent noticeDetail={noticeDetail?.result} />}
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
