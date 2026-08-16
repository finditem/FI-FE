import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const REPORT_REASONS = [
  { value: "IRRELEVANT_CONTENT" },
  { value: "DUPLICATE" },
  { value: "SPAM" },
  { value: "OFFENSIVE_LANGUAGE" },
  { value: "EXTORTION" },
  { value: "FALSE_CLAIM" },
  { value: "ETC" },
] as const;

export const useReportReasons = () => {
  const t = useTranslations("ReportReasons");
  return useMemo(
    () => REPORT_REASONS.map((reason) => ({ ...reason, label: t(reason.value) })),
    [t]
  );
};
