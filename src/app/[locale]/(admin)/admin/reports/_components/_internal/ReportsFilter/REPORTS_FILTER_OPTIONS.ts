const REPORT_STATUS_OPTIONS = [
  { label: "상태", value: "" },
  { label: "접수", value: "pending" },
  { label: "처리 중", value: "reviewed" },
  { label: "처리 완료", value: "resolved" },
];

const INQUIRY_STATUS_OPTIONS = [
  { label: "상태", value: "" },
  { label: "접수", value: "received" },
  { label: "검토 중", value: "pending" },
  { label: "처리 완료", value: "answered" },
];

const REPORTS_ANSWER_OPTIONS = [
  { label: "답변", value: "" },
  { label: "미답변", value: "false" },
  { label: "답변완료", value: "true" },
];

export const FILTER_CONFIG = {
  report: {
    statusOptions: REPORT_STATUS_OPTIONS,
    answerOptions: REPORTS_ANSWER_OPTIONS,
  },
  inquiry: {
    statusOptions: INQUIRY_STATUS_OPTIONS,
    answerOptions: REPORTS_ANSWER_OPTIONS,
  },
};
