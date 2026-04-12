"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { PostPostsCommentResponse } from "../types/PostPostsComment";

export const usePostPostsComments = (postId: number, parentId?: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<FormData, PostPostsCommentResponse>(
    "auth",
    `/comments/posts/${postId}`,
    "post",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          ...(parentId
            ? { queryKey: ["replies-post-comments", parentId] }
            : { queryKey: ["post-comments", postId] }),
        });
        queryClient.invalidateQueries({ queryKey: ["/users/me/comments"] });
        addToast("댓글이 등록되었어요", "success");
      },
      onError: () => {
        addToast("댓글 등록에 실패했어요", "error");
      },
    }
  );
};
