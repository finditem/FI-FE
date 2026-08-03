import { InquiryStatus, ReportStatus } from "@/types";
import { StatusBadgeConfig } from "../../_types";

type ProcessStatus = InquiryStatus | ReportStatus;

export const ProcessStatusBadgeConfig: Record<ProcessStatus, StatusBadgeConfig> = {
  PENDING: {
    label: "접수",
    className: "text-neutral-strong-default bg-fill-neutral-strong-default",
  },
  RECEIVED: {
    label: "검토 중",
    className: "text-brand-normal-default bg-fill-brand-subtle-default",
  },
  REVIEWED: {
    label: "처리 중",
    className: "text-brand-normal-default bg-fill-brand-subtle-default",
  },
  ANSWERED: {
    label: "처리 완료",
    className: "text-white bg-toast",
  },
  RESOLVED: {
    label: "처리 완료",
    className: "text-white bg-toast",
  },
};

export const ReplyStatusBadgeConfig = (answered: boolean): StatusBadgeConfig =>
  answered
    ? { label: "답변 완료", className: "text-white bg-toast" }
    : { label: "미답변", className: "text-neutral-strong-default bg-fill-neutral-strong-default" };
