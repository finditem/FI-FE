import { InquiryStatus, ReportStatus } from "@/types";

type StatusOption<T> = {
  label: string;
  value: T;
};

const REPORT_DETAIL_STATUS_OPTIONS: StatusOption<ReportStatus>[] = [
  { label: "접수", value: "PENDING" },
  { label: "처리 중", value: "REVIEWED" },
  { label: "처리 완료", value: "RESOLVED" },
];

const INQUIRY_DETAIL_STATUS_OPTIONS: StatusOption<InquiryStatus>[] = [
  { label: "접수", value: "PENDING" },
  { label: "검토 중", value: "RECEIVED" },
  { label: "처리 완료", value: "ANSWERED" },
];

export const DETAIL_STATUS_CONFIG = {
  report: {
    statusOptions: REPORT_DETAIL_STATUS_OPTIONS,
  },
  inquiry: {
    statusOptions: INQUIRY_DETAIL_STATUS_OPTIONS,
  },
};
