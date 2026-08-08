import { useGetDetailInquiry, useGetDetailReport } from "@/api/fetch/admin";
import { ReportsType } from "../_types/ReportsType";

interface UseReportsListQueryParams {
  id: number;
  type: ReportsType;
}

export const useReportsDetailQuery = ({ id, type }: UseReportsListQueryParams) => {
  const detailReportQuery = useGetDetailReport({ reportId: id }, { enabled: type === "report" });

  const detailInquiryQuery = useGetDetailInquiry(
    { inquiryId: id },
    { enabled: type === "inquiry" }
  );

  return type === "report" ? detailReportQuery : detailInquiryQuery;
};
