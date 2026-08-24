"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { PostPostsWriteResponse } from "../types/PostWriteType";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export const usePutPost = (postId: number) => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("usePutPost");

  return useAppMutation<FormData, PostPostsWriteResponse>("auth", `/posts/${postId}`, "put", {
    onSuccess: async (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post-detail", postId] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] }),
      ]);
      addToast(t("updateSuccess"), "success");
      router.replace(`/list/${data.result.id}`);
    },
    onError: () => {
      addToast(t("updateError"), "error");
    },
  });
};
