import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { PostNoticeCommentResponse } from "../types/PostNoticeComments";

export const usePostNoticeComment = (noticeId: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePostNoticeComment");

  return useAppMutation<FormData, PostNoticeCommentResponse>(
    "auth",
    `/notices/${noticeId}/comments`,
    "post",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notice-comments", noticeId] });
        addToast(t("commentSuccess"), "success");
      },
      onError: () => {
        addToast(t("commentError"), "error");
      },
    }
  );
};
