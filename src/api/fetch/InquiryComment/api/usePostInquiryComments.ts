import { useQueryClient } from "@tanstack/react-query";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { PostInquiryCommentsResponse } from "../types/PostInquiryCommentsType";

export const usePostInquiryComments = (inquiryId: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<FormData, PostInquiryCommentsResponse>(
    "auth",
    `/inquiries/${inquiryId}/comments`,
    "post",
    {
      onSuccess: () => {
        addToast("댓글이 등록되었습니다.", "success");
        queryClient.invalidateQueries({
          queryKey: ["detail-inquiry", inquiryId],
        });
      },
    }
  );
};
