import { useGetInquiries, useGetReport } from "@/api/fetch/admin";
import { ReportsTabType } from "../_types/ReportsTabType";
import { InquiryStatus, ReportStatus } from "@/types";

interface UseReportsListQueryParams {
  activeTab: ReportsTabType;
  keyword?: string;
  reportStatus?: ReportStatus;
  inquiryStatus?: InquiryStatus;
  answered?: boolean;
}

export const useReportsListQuery = ({
  activeTab,
  keyword,
  reportStatus,
  inquiryStatus,
  answered,
}: UseReportsListQueryParams) => {
  const reportQuery = useGetReport(
    { status: reportStatus, answered, keyword },
    { enabled: activeTab === "report" }
  );

  const inquiryQuery = useGetInquiries(
    { status: inquiryStatus, answered, keyword },
    { enabled: activeTab === "inquiry" }
  );

  return activeTab === "report" ? reportQuery : inquiryQuery;
};
