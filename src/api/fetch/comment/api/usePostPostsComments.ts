"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { PostPostsCommentResponse } from "../types/PostPostsComment";

export const usePostPostsComments = (postId: number, parentId?: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePostPostsComments");

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
        addToast(t("commentSuccess"), "success");
      },
      onError: () => {
        addToast(t("commentError"), "error");
      },
    }
  );
};
