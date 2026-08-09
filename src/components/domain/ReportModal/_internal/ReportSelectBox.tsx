"use client";

import { useTranslations } from "next-intl";
import { Icon, RequiredText } from "@/components/common";
import { cn } from "@/utils";
import { ReportReason } from "./ReportTypes";

interface ReportSelectBoxProps {
  reportType: ReportReason | null;
  setOpenReportReasonModal: (open: boolean) => void;
}

const ReportSelectBox = ({ reportType, setOpenReportReasonModal }: ReportSelectBoxProps) => {
  const t = useTranslations("ReportSelectBox");

  return (
    <div className="flex flex-col gap-1">
      <label className="text-body2-regular text-layout-body-default">
        {t("label")} <RequiredText />
      </label>
      <button
        type="button"
        aria-label={t("ariaLabel")}
        onClick={() => setOpenReportReasonModal(true)}
        className={cn(
          "flex items-center justify-between rounded-[10px] border border-neutral-normal-default px-5 py-[18px] text-body1-medium",
          reportType ? "text-neutral-normal-enteredSelected" : "text-neutral-normal-placeholder"
        )}
      >
        {reportType ? reportType.label : t("placeholder")}
        <Icon name="ArrowDown" size={24} />
      </button>
    </div>
  );
};

export default ReportSelectBox;
