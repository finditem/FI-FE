import { REPORT_REASONS } from "./REPORT_REASONS";

export type ReportReason = (typeof REPORT_REASONS)[number] & { label: string };
