import { useMemo } from "react";
import { throttle } from "lodash";
import { useDeleteLikeComment, usePostLikeComment } from "@/api/fetch/comment";
import { ToggleCommentLikeVariables } from "@/api/fetch/comment/types/CommentType";

interface ToggleFavoriteProps extends ToggleCommentLikeVariables {
  isLike: boolean;
}

export const useToggleCommentLike = () => {
  const { mutate: postCommentLike, isPending: postPending } = usePostLikeComment();
  const { mutate: deleteCommentLike, isPending: deletePending } = useDeleteLikeComment();

  const handleToggleFavorite = useMemo(
    () =>
      throttle(({ isLike, commentId, queryKey }: ToggleFavoriteProps) => {
        if (isLike) {
          deleteCommentLike({ commentId, queryKey });
        } else {
          postCommentLike({ commentId, queryKey });
        }
      }, 300),
    [postCommentLike, deleteCommentLike]
  );

  return {
    handleToggleFavorite,
    isPending: postPending || deletePending,
  };
};
