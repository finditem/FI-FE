import useAppMutation from "@/api/_base/query/useAppMutation";
import { ReportReason } from "@/components";
import { useToast } from "@/context/ToastContext";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReportRequest } from "../types/ReportRequest";
import { AxiosError } from "axios";

interface UseReportParams {
  reset: () => void;
  setReportType: (reportType: ReportReason | null) => void;
  invalidateKeys?: QueryKey[];
  onClose: () => void;
}

export const useReport = ({ reset, setReportType, invalidateKeys, onClose }: UseReportParams) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("useReport");

  return useAppMutation<ReportRequest, unknown, AxiosError>("auth", "/reports", "post", {
    onSuccess: () => {
      reset();
      setReportType(null);
      toast.addToast(t("reportSuccess"), "success");
      queryClient.invalidateQueries({ queryKey: ["reports/me"] });
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      onClose();
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.addToast(t("alreadyReported"), "error");
        return;
      }
      toast.addToast(t("reportError"), "error");
    },
  });
};
