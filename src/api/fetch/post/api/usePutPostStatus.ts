"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PutPostStatusRequestBody } from "../types/PutPostStatusType";

interface UsePutPostStatusOptions {
  /** true면 성공 토스트를 띄우지 않는다. 실패 토스트는 항상 띄운다. (default: false) */
  silent?: boolean;
}

export const usePutPostStatus = (
  postId: number,
  isFound: boolean,
  options?: UsePutPostStatusOptions
) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePutPostStatus");
  const silent = options?.silent ?? false;

  return useAppMutation<PutPostStatusRequestBody>("auth", `/posts/${postId}/status`, "put", {
    onSuccess: () => {
      if (!silent) {
        addToast(isFound ? t("changeToSearchingSuccess") : t("changeToFoundSuccess"), "success");
      }
      queryClient.invalidateQueries({ queryKey: ["post-detail", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] });
    },
    onError: () => {
      addToast(isFound ? t("changeToSearchingError") : t("changeToFoundError"), "error");
    },
  });
};
