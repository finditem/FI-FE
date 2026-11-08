"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePostNoticeComment } from "@/api/fetch/noticeComment";

export const useHandleNoticeReplySubmit = (noticeId: number) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostNoticeComment(noticeId);

  const handleReplySubmit = async (content: string, image: File | null, parentId: number) => {
    if (!content.trim() || isPending) return;

    const formData = new FormData();

    const request = {
      content: content.trim(),
      parentId,
    };

    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    if (image) formData.append("images", image);

    return mutateAsync(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["replies-notice-comments", parentId] });
      },
    });
  };

  return {
    handleReplySubmit,
    isPending,
  };
};
