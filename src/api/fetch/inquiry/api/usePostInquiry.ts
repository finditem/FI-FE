import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const usePostInquiry = (isUserSuccess: boolean) => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("InquiryWrite");

  return useAppMutation<FormData, ApiBaseResponseType<number>>("auth", "/inquiries", "post", {
    onSuccess: ({ result }) => {
      addToast(t("submitSuccess"), "success");
      if (isUserSuccess) {
        queryClient.invalidateQueries({ queryKey: ["/inquiries/me"] });
        router.replace(`/mypage/inquiries/${result}`);
        return;
      }
      router.replace("/mypage");
    },
    onError: () => {
      addToast(t("submitError"), "error");
    },
  });
};
