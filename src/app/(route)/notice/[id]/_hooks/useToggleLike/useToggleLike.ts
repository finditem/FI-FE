import { useMemo } from "react";
import { throttle } from "lodash";
import { useDeleteNoticeLike, usePostNoticeLike } from "@/api/fetch/notice";

interface ToggleLikeProps {
  noticeId: number;
}

export const useToggleLike = ({ noticeId }: ToggleLikeProps) => {
  const { mutate: postLike, isPending: postPending } = usePostNoticeLike(noticeId);
  const { mutate: deleteLike, isPending: deletePending } = useDeleteNoticeLike(noticeId);

  const handleToggleLike = useMemo(
    () =>
      throttle((likeStatus: boolean) => {
        likeStatus ? deleteLike({}) : postLike({});
      }, 300),
    [postLike, deleteLike]
  );

  return {
    handleToggleLike,
    isPending: postPending || deletePending,
  };
};
