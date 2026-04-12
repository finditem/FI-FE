import useAppMutation from "@/api/_base/query/useAppMutation";
import { ReportReason } from "@/components/domain/ReportModal/_internal";
import { useToast } from "@/context/ToastContext";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { ReportRequest } from "../types/ReportRequest";
import { AxiosError } from "axios";

interface UseReportParams {
  reset: () => void;
  setReportType: (reportType: ReportReason | null) => void;
  invalidateKeys?: QueryKey[];
  onClose: () => void;
}

const useReport = ({ reset, setReportType, invalidateKeys, onClose }: UseReportParams) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<ReportRequest, unknown, AxiosError>("auth", "/reports", "post", {
    onSuccess: () => {
      reset();
      setReportType(null);
      toast.addToast("신고가 접수되었어요", "success");
      queryClient.invalidateQueries({ queryKey: ["reports/me"] });
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      onClose();
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.addToast("이미 접수된 신고입니다.", "error");
        return;
      }
      toast.addToast("신고에 실패했습니다.", "error");
    },
  });
};

export default useReport;
