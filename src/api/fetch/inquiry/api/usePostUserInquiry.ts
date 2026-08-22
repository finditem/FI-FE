import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PostUserInquiryResponseType } from "../types/PostUserInquiryResponseType";

export const usePostUserInquiry = ({ inquiryId }: { inquiryId: number }) => {
  const { addToast } = useToast();
  const t = useTranslations("usePostUserInquiry");

  const queryClient = useQueryClient();

  return useAppMutation<FormData, PostUserInquiryResponseType, ApiBaseResponseType<null>>(
    "auth",
    `/inquiries/${inquiryId}/comments`,
    "post",
    {
      onSuccess: () => {
        addToast(t("commentSuccess"), "success");
        queryClient.invalidateQueries({ queryKey: ["/inquiries/id", inquiryId] });
      },
      onError: () => addToast(t("commentError"), "error"),
    }
  );
};
