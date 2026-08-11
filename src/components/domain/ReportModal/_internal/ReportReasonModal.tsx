"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useReportReasons } from "./REPORT_REASONS";
import { createPortal } from "react-dom";
import { Button, RadioOptionItem } from "@/components/common";
import { ReportReason } from "./ReportTypes";
import { useModalLockAndEsc } from "@/hooks";

interface ReportReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportReason | null;
  setReportType: (reason: ReportReason) => void;
}

const ReportReasonModal = ({
  isOpen,
  onClose,
  reportType,
  setReportType,
}: ReportReasonModalProps) => {
  const t = useTranslations("ReportReasonModal");
  const REPORT_REASONS = useReportReasons();
  const [tempSelectedReportReason, setTempSelectedReportReason] = useState<ReportReason | null>(
    reportType ?? null
  );
  useModalLockAndEsc({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      setTempSelectedReportReason(reportType ?? null);
    }
  }, [reportType, isOpen]);

  if (!isOpen) return null;

  const handleSelectReportReason = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tempSelectedReportReason) {
      setReportType(tempSelectedReportReason);
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex select-none items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <form
        className="absolute bottom-0 flex h-[671px] w-full max-w-[768px] flex-col rounded-t-[20px] bg-white py-10"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSelectReportReason}
      >
        <h1 className="mb-8 text-center text-h2-medium text-layout-header-default">{t("title")}</h1>
        <fieldset className="flex flex-col gap-[2px]">
          {REPORT_REASONS.map((reason) => (
            <RadioOptionItem
              key={reason.value}
              option={{ value: reason.value, label: reason.label }}
              selected={tempSelectedReportReason?.value ?? ""}
              onChange={() => setTempSelectedReportReason(reason)}
              inputName="reportReason"
            />
          ))}
        </fieldset>
        <div className="mt-auto px-5">
          <Button className="w-full" size="big" disabled={!tempSelectedReportReason} type="submit">
            {t("select")}
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default ReportReasonModal;
