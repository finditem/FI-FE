import { InquiryFilterStatus } from "@/types";

export const INQUIRIES_LABEL_MAP: Record<InquiryFilterStatus, string> = {
  ALL: "전체",
  RECEIVED: "접수",
  PENDING: "검토 중",
  ANSWERED: "답변 완료",
};

export const INQUIRIES_KEBAB_OPTIONS = [
  { label: "전체", value: undefined },
  { label: "접수", value: "RECEIVED" },
  { label: "검토 중", value: "PENDING" },
  { label: "답변 완료", value: "ANSWERED" },
] as const;
