import { usePutInquiryStatus, usePutReportStatus } from "@/api/fetch/admin";
import { ReportsType } from "../_types/ReportsType";
import { InquiryStatus, ReportStatus } from "@/types";

interface UseReportsDetailStatusParams {
  id: number;
  type: ReportsType;
  isGuest: boolean;
}

export const useReportsDetailStatus = ({ id, type, isGuest }: UseReportsDetailStatusParams) => {
  const { mutate: updateReportStatus, isPending: isReportPending } = usePutReportStatus(id);
  const { mutate: updateInquiryStatus, isPending: isInquiryPending } = usePutInquiryStatus({
    inquiryId: id,
    isGuest,
  });

  const changeStatus = (value: string) => {
    if (type === "report") {
      updateReportStatus({
        status: value as ReportStatus,
      });
    } else {
      updateInquiryStatus({
        status: value as InquiryStatus,
      });
    }
  };

  return {
    changeStatus,
    isPending: isReportPending || isInquiryPending,
  };
};
