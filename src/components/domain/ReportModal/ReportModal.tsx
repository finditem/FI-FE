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

/**
 * 게시글·댓글·채팅·사용자 등 대상에 대한 신고 폼을 바텀 시트 형태로 띄웁니다.
 *
 * @remarks
 * - `react-hook-form`(`mode: onChange`)으로 선택 사유 외 추가 설명(`reason`)을 다룹니다.
 * - 신고 사유는 필수이며, 내용 입력은 공백만 넘기면 API에는 빈 문자열로 보냅니다.
 * - 제출 시 `useReport` 뮤테이션을 호출하며, 진행 중에는 제출 버튼이 비활성화됩니다.
 * - 성공·실패 토스트 및 쿼리 무효화는 `useReport` 내부에서 처리합니다.
 *
 * @author hyungjun
 */
interface ReportModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 닫기(헤더 뒤로가기 포함) 시 호출 */
  onClose: () => void;
  /** 신고 API에 넘길 대상 종류 */
  targetType: ReportTargetType;
  /** 신고 API에 넘길 대상 ID */
  targetId: number;
  /** 성공 후 추가로 무효화할 TanStack Query 키(선택) */
  invalidateKeys?: QueryKey[];
}

/**
 * @example
 * ```tsx
 * const [reportOpen, setReportOpen] = useState(false);
 *
 * <ReportModal
 *   isOpen={reportOpen}
 *   onClose={() => setReportOpen(false)}
 *   targetType="CHAT"
 *   targetId={roomId}
 *   invalidateKeys={[["chatRoom", roomId], ["posts"]]}
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
