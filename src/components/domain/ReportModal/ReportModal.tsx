"use client";

import { DetailHeader } from "@/components/layout";
import { Button, InputField } from "@/components/common";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { QueryKey } from "@tanstack/react-query";
import { ReportReasonModal, ReportPopupLayout, ReportReason, ReportSelectBox } from "./_internal";
import useReport from "@/api/fetch/report/api/useReport";
import { ReportTargetType } from "@/types";

type ReportFormValues = {
  reason: string;
};

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: number;
  invalidateKeys?: QueryKey[];
}

/**
 * @author hyungjun
 *
 * @description
 * 신고하기 폼을 제공하는 모달 컴포넌트입니다.
 * 신고 사유 선택 및 신고 내용 입력 기능을 포함하며, react-hook-form을 사용하여 폼 상태를 관리합니다.
 * 신고 사유는 필수이며, 신고 내용은 선택 사항입니다
 *
 * @param isOpen - 모달의 열림/닫힘 상태
 * @param onClose - 모달을 닫을 때 호출되는 콜백 함수
 * @param targetType - 신고 대상의 타입 ("CHAT" | "POST" | "COMMENT" | "USER")
 * @param targetId - 신고 대상의 ID
 * @param invalidateKeys - 신고 성공 후 무효화할 Tanstack Query 키 목록 (선택)
 *
 * @example
 * ```tsx
 * const [reportOpen, setReportOpen] = useState(false);
 *
 * <ReportModal
 *   isOpen={reportOpen}
 *   onClose={() => setReportOpen(false)}
 *   targetType="CHAT"
 *   targetId={roomId}
 *   invalidateKeys={[ ["chatRoom", roomId], ["posts"], ["user-block-list"] ]}
 * />
 * ```
 */

const ReportModal = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  invalidateKeys,
}: ReportModalProps) => {
  const [openReportReasonModal, setOpenReportReasonModal] = useState(false);
  const [reportType, setReportType] = useState<ReportReason | null>(null);
  const methods = useForm<ReportFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { mutate: report, isPending } = useReport({
    reset: () => methods.reset(),
    setReportType: (reportType: ReportReason | null) => setReportType(reportType),
    invalidateKeys,
    onClose: onClose,
  });

  const isDisabled = !reportType || isPending;

  const onSubmit = ({ reason }: ReportFormValues) => {
    if (isDisabled) return;

    const isOnlyWhitespace = reason.trim().length === 0;
    const payloadReason = isOnlyWhitespace ? "" : reason;

    report({
      targetType,
      targetId,
      reason: payloadReason,
      reportType: reportType.value,
    });
  };

  return (
    <ReportPopupLayout isOpen={isOpen}>
      <DetailHeader title="신고하기" onBack={onClose} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-10 p-5">
            <ReportSelectBox
              reportType={reportType}
              setOpenReportReasonModal={setOpenReportReasonModal}
            />
            <InputField
              name="reason"
              label="신고 내용 (선택)"
              placeholder="신고 사유를 입력해주세요. (최대 300자)"
              maxLength={300}
            />
          </div>

          <div className="fixed bottom-0 w-full max-w-[768px] border-t border-flatGray-50 px-4 pb-8 pt-3">
            <Button type="submit" size="big" className="w-full" disabled={isDisabled}>
              차단 및 신고하기
            </Button>
          </div>
        </form>
      </FormProvider>
      <ReportReasonModal
        isOpen={openReportReasonModal}
        onClose={() => setOpenReportReasonModal(false)}
        reportType={reportType}
        setReportType={setReportType}
      />
    </ReportPopupLayout>
  );
};

export default ReportModal;
