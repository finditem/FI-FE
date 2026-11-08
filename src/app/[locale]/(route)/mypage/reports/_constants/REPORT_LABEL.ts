import { ReportFilterStatus } from "@/types";

export const REPORTS_LABEL_MAP: Record<ReportFilterStatus, string> = {
  ALL: "all",
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
};

export const REPORTS_KEBAB_OPTIONS = [
  { labelKey: "all", value: undefined },
  { labelKey: "pending", value: "PENDING" },
  { labelKey: "reviewed", value: "REVIEWED" },
  { labelKey: "resolved", value: "RESOLVED" },
] as const;
