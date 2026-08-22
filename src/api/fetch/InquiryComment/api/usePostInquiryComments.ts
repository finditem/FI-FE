import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { PostInquiryCommentsResponse } from "../types/PostInquiryCommentsType";

export const usePostInquiryComments = (inquiryId: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePostInquiryComments");

  return useAppMutation<FormData, PostInquiryCommentsResponse>(
    "auth",
    `/inquiries/${inquiryId}/comments`,
    "post",
    {
      onSuccess: () => {
        addToast(t("commentRegistered"), "success");
        queryClient.invalidateQueries({
          queryKey: ["detail-inquiry", inquiryId],
        });
      },
    }
  );
};
