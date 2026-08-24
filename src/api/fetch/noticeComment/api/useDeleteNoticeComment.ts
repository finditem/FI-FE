"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import {
  DeleteNoticeCommentResponse,
  DeleteNoticeCommentVariables,
} from "../types/DeleteNoticeCommentType";

export const useDeleteNoticeComment = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const t = useTranslations("useDeleteNoticeComment");

  return useAppMutation<DeleteNoticeCommentVariables, DeleteNoticeCommentResponse>(
    "auth",
    ({ commentId }) => `/notices/comments/${commentId}`,
    "delete",
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: variables.queryKey });
        addToast(t("deleteSuccess"), "success");
      },
    }
  );
};
