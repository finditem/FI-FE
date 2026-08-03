import { useMemo } from "react";
import { throttle } from "lodash";
import { useDeleteNoticeCommentLike, usePostNoticeCommentLike } from "@/api/fetch/noticeComment";
import { ToggleCommentLikeVariables } from "@/api/fetch/comment/types/CommentType";

interface ToggleFavoriteProps extends ToggleCommentLikeVariables {
  isLike: boolean;
}

export const useToggleNoticeCommentLike = (noticeId: number) => {
  const { mutate: postNoticeCommentLike, isPending: postPending } =
    usePostNoticeCommentLike(noticeId);
  const { mutate: deleteNoticeCommentLike, isPending: deletePending } =
    useDeleteNoticeCommentLike(noticeId);

  const handleToggleFavorite = useMemo(
    () =>
      throttle(({ isLike, commentId, queryKey }: ToggleFavoriteProps) => {
        if (isLike) {
          deleteNoticeCommentLike({ commentId, queryKey });
        } else {
          postNoticeCommentLike({ commentId, queryKey });
        }
      }, 300),
    [postNoticeCommentLike, deleteNoticeCommentLike]
  );

  return {
    handleToggleFavorite,
    isPending: postPending || deletePending,
  };
};
