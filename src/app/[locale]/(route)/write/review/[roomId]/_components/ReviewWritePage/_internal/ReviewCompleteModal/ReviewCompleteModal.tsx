"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, ModalLayout } from "@/components/common";

interface ReviewCompleteModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** "확인" 클릭(백드롭/ESC 포함) 시 호출 (스펙상 이전 화면으로 이동) */
  onConfirm: () => void;
  /** "보낸 후기 보기" 클릭 시 호출 */
  onViewSentReview: () => void;
}

/**
 * 찾길 후기가 정상 등록된 뒤 노출되는 후기 작성 완료 팝업입니다. (기획 스펙 3-5)
 *
 * @remarks
 * 백드롭/ESC로도 닫히며, 이때도 `onConfirm`과 동일하게 처리합니다.
 *
 * @author suhyeon
 */
const ReviewCompleteModal = ({ isOpen, onConfirm, onViewSentReview }: ReviewCompleteModalProps) => {
  const t = useTranslations("ReviewCompleteModal");

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onConfirm}
      className="w-[320px] gap-6 p-6 flex-col-center"
    >
      <div className="gap-4 flex-col-center">
        <Image src="/review/review-thanks.webp" alt="" width={76} height={72} />
        <div className="gap-1 text-center flex-col-center">
          <p className="whitespace-pre-line text-h3-semibold text-layout-header-default">
            {t("title")}
          </p>
          <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
        </div>
      </div>

      <div className="flex w-full gap-2">
        <Button variant="outlined" size="big" onClick={onConfirm}>
          {t("confirmLabel")}
        </Button>
        <Button
          ignoreBase
          className="flex-1 rounded-[10px] py-[10px] text-body1-semibold text-white bg-fill-brand-strong-default flex-center"
          onClick={onViewSentReview}
        >
          {t("viewSentReviewLabel")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default ReviewCompleteModal;
