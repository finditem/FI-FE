import { usePostInquiryComments } from "@/api/fetch/InquiryComment";
import { usePostReportComments } from "@/api/fetch/admin";
import { ReportsType } from "../_types/ReportsType";

interface UsePostReportsCommentParams {
  reportsId: number;
  reportsType: ReportsType;
}

export const usePostReportsComment = ({ reportsId, reportsType }: UsePostReportsCommentParams) => {
  const inquiryMutation = usePostInquiryComments(reportsId);
  const reportMutation = usePostReportComments(reportsId);

  const mutateAsync = async (data: { content: string; images: string[]; fileImages?: File[] }) => {
    if (reportsType === "inquiry") {
      const formData = new FormData();
      const request = {
        content: data.content,
      };

      formData.append("comment", new Blob([JSON.stringify(request)], { type: "application/json" }));

      data.fileImages?.forEach((file) => {
        formData.append("images", file);
      });

      return inquiryMutation.mutateAsync(formData);
    }
    return reportMutation.mutateAsync({ adminAnswer: data.content, images: data.images });
  };

  const isPending =
    reportsType === "inquiry" ? inquiryMutation.isPending : reportMutation.isPending;

  return {
    mutateAsync,
    isPending,
  };
};
