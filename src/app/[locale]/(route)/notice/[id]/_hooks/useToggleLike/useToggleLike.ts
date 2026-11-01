import { useMemo } from "react";
import { throttle } from "es-toolkit/compat";
import { useDeleteNoticeLike, usePostNoticeLike } from "@/api/fetch/notice";

interface ToggleLikeProps {
  noticeId: number;
  isLoggedIn: boolean;
  openGuestModal: () => void;
}

export const useToggleLike = ({ noticeId, isLoggedIn, openGuestModal }: ToggleLikeProps) => {
  const { mutate: postLike, isPending: postPending } = usePostNoticeLike(noticeId);
  const { mutate: deleteLike, isPending: deletePending } = useDeleteNoticeLike(noticeId);

  const toggleLike = useMemo(
    () =>
      throttle((likeStatus: boolean) => {
        likeStatus ? deleteLike({}) : postLike({});
      }, 300),
    [postLike, deleteLike]
  );

  const handleToggleLike = (likeStatus: boolean) => {
    if (!isLoggedIn) {
      openGuestModal();
      return;
    }

    toggleLike(likeStatus);
  };

  return {
    handleToggleLike,
    isPending: postPending || deletePending,
  };
};
