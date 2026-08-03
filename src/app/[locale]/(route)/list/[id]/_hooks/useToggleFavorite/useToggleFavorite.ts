import { useMemo } from "react";
import { throttle } from "lodash";
import { useGetUsersMe } from "@/api/fetch/user";
import { useDeletePostFavorites, usePostFavorites } from "@/api/fetch/post";

interface ToggleFavoriteProps {
  postId: number;
}

export const useToggleFavorite = ({ postId }: ToggleFavoriteProps) => {
  const { mutate: postFavorite, isPending: postPending } = usePostFavorites(postId);
  const { mutate: deleteFavorite, isPending: deletePending } = useDeletePostFavorites(postId);
  const { data: me } = useGetUsersMe();

  const handleToggleFavorite = useMemo(
    () =>
      throttle((favoriteStatus: boolean) => {
        if (!me) return;

        favoriteStatus ? deleteFavorite({ postId }) : postFavorite({ postId });
      }, 300),
    [postId, postFavorite, deleteFavorite, me]
  );

  return {
    handleToggleFavorite,
    isPending: postPending || deletePending,
  };
};
