"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";

export const usePostTempPost = () => {
  const { addToast } = useToast();
  const t = useTranslations("usePostTempPost");

  return useAppMutation<FormData>("auth", "/posts/temp", "post", {
    onSuccess: () => {
      addToast(t("saveSuccess"), "success");
    },
    onError: () => {
      addToast(t("saveError"), "error");
    },
  });
};
