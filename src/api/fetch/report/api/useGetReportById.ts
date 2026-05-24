import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { GetReportsByIdResponseType } from "../types/GetReportsByIdResponseType";

export const useGetReportById = ({ reportId }: { reportId: number }) => {
  return useAppQuery<GetReportsByIdResponseType, ApiBaseResponseType<null>>(
    "auth",
    ["/reports/id", reportId],
    `/reports/${reportId}`
  );
};
