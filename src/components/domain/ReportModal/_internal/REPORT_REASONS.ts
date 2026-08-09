import { useTranslations } from "next-intl";

export const REPORT_REASONS = [
  { id: "1", value: "IRRELEVANT_CONTENT" },
  { id: "2", value: "DUPLICATE" },
  { id: "3", value: "SPAM" },
  { id: "4", value: "OFFENSIVE_LANGUAGE" },
  { id: "5", value: "EXTORTION" },
  { id: "6", value: "FALSE_CLAIM" },
  { id: "7", value: "ETC" },
] as const;

export const useReportReasons = () => {
  const t = useTranslations("ReportReasons");
  return REPORT_REASONS.map((reason) => ({ ...reason, label: t(reason.value) }));
};
