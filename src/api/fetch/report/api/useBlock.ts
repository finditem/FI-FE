"use client";

import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import { useSnackBar } from "@/context/SnackBarContext";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { BLOCK_ERROR_MESSAGE_KEY } from "./BLOCK_ERROR_MESSAGE";
import { useRouter } from "next/navigation";

interface UseBlockParams {
  onClose: () => void;
  userId: number;
}

export const useBlock = ({ onClose, userId }: UseBlockParams) => {
  const toast = useToast();
  const { showSnackBar } = useSnackBar();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("useBlock");

  return useAppMutation<void, unknown, AxiosError>("auth", `/reports/${userId}/block`, "post", {
    onSuccess: () => {
      showSnackBar(t("blockSuccess"), t("moveToBlockList"), () => {
        router.push("/mypage/blocked-users");
      });
      queryClient.invalidateQueries({ queryKey: ["user-block-list"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.replace("/list");
      onClose();
    },
    onError: (error) => {
      const status = error.response?.status;
      const messageKey = status && BLOCK_ERROR_MESSAGE_KEY[status];

      if (messageKey) {
        toast.addToast(t(messageKey), "error");
        return;
      }

      toast.addToast(t("blockError"), "error");
    },
  });
};
