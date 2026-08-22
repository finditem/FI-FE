"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  PostDeleteDetailRequestBody,
  PostDeleteDetailResponse,
} from "../types/PostDeleteDetailType";

export const useDeleteDetailPost = (id: number) => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("useDeleteDetailPost");

  return useAppMutation<PostDeleteDetailRequestBody, PostDeleteDetailResponse>(
    "auth",
    `/posts/${id}`,
    "delete",
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] }),
        ]);
        addToast(t("deleteSuccess"), "success");
        router.replace("/list");
      },
      onError: () => {
        addToast(t("deleteError"), "error");
      },
    },
    { sendDeleteBody: true }
  );
};
