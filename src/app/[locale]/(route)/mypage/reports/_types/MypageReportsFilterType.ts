import { ReportFilterStatus } from "@/types";

export type ReportStatusFilterValue = ReportFilterStatus | undefined;

export interface ReportStatusFilterState {
  reportStatus: ReportStatusFilterValue;
}
