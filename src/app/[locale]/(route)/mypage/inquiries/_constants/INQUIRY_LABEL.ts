import { InquiryFilterStatus } from "@/types";

export const INQUIRIES_LABEL_MAP: Record<InquiryFilterStatus, string> = {
  ALL: "all",
  RECEIVED: "received",
  PENDING: "pending",
  ANSWERED: "answered",
};

export const INQUIRIES_KEBAB_OPTIONS = [
  { labelKey: "all", value: undefined },
  { labelKey: "received", value: "RECEIVED" },
  { labelKey: "pending", value: "PENDING" },
  { labelKey: "answered", value: "ANSWERED" },
] as const;
