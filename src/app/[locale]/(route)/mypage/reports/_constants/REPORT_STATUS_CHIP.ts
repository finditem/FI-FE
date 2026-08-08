export const REPORT_STATUS_CHIP = {
  PENDING: { label: "접수", chipType: "neutralStrong" },
  REVIEWED: { label: "처리 중", chipType: "brandSubtle" },
  RESOLVED: { label: "처리 완료", chipType: "brandNormal" },
} as const;
