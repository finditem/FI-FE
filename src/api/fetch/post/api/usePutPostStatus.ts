"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PutPostStatusRequestBody } from "../types/PutPostStatusType";

export const usePutPostStatus = (postId: number, isFound: boolean) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePutPostStatus");

  return useAppMutation<PutPostStatusRequestBody>("auth", `/posts/${postId}/status`, "put", {
    onSuccess: () => {
      addToast(
        isFound ? t("changeToSearchingSuccess") : t("changeToFoundSuccess"),
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["post-detail", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] });
    },
    onError: () => {
      addToast(
        isFound ? t("changeToSearchingError") : t("changeToFoundError"),
        "error"
      );
    },
  });
};
