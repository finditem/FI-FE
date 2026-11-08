"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { CommentDeleteResponse, DeleteCommentVariables } from "../types/CommentDeleteType";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const t = useTranslations("useDeleteComment");

  return useAppMutation<DeleteCommentVariables, CommentDeleteResponse>(
    "auth",
    ({ commentId }) => `/comments/${commentId}`,
    "delete",
    {
      onSuccess: async (_, variables) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: variables.queryKey }),
          queryClient.invalidateQueries({ queryKey: ["/users/me/comments"] }),
        ]);
        addToast(t("deleteSuccess"), "success");
      },
    }
  );
};
