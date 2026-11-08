import { useMemo } from "react";
import { throttle } from "es-toolkit/compat";
import { useGetUsersMe } from "@/api/fetch/user";
import { useDeletePostFavorites, usePostFavorites } from "@/api/fetch/post";

interface ToggleFavoriteProps {
  postId: number;
  openGuestModal: () => void;
}

export const useToggleFavorite = ({ postId, openGuestModal }: ToggleFavoriteProps) => {
  const { mutate: postFavorite, isPending: postPending } = usePostFavorites(postId);
  const { mutate: deleteFavorite, isPending: deletePending } = useDeletePostFavorites(postId);
  const { data: me } = useGetUsersMe();

  const toggleFavorite = useMemo(
    () =>
      throttle((favoriteStatus: boolean) => {
        favoriteStatus ? deleteFavorite({ postId }) : postFavorite({ postId });
      }, 300),
    [postId, postFavorite, deleteFavorite]
  );

  const handleToggleFavorite = (favoriteStatus: boolean) => {
    if (!me) {
      openGuestModal();
      return;
    }

    toggleFavorite(favoriteStatus);
  };

  return {
    handleToggleFavorite,
    isPending: postPending || deletePending,
  };
};
