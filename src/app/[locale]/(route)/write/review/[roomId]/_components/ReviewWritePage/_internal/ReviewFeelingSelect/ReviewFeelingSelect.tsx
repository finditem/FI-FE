"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";

export type ReviewFeelingValue = "touched" | "grateful" | "heartFlutter";

const FEELING_VALUES: ReviewFeelingValue[] = ["touched", "grateful", "heartFlutter"];

interface ReviewFeelingSelectProps {
  value: ReviewFeelingValue | null;
  onChange: (value: ReviewFeelingValue) => void;
}

/**
 * 후기 작성 시 상대방과의 만남에서 느낀 감정을 하나 고르는 선택 UI입니다.
 *
 * @remarks
 * 아이콘 자산은 Figma API 호출 제한으로 아직 받아오지 못해 빈 원으로 자리만 잡아둔 상태입니다.
 *
 * @author suhyeon
 */
const ReviewFeelingSelect = ({ value, onChange }: ReviewFeelingSelectProps) => {
  const t = useTranslations("ReviewWritePage");

  return (
    <div className="flex gap-6" role="radiogroup" aria-label={t("feelingsAriaLabel")}>
      {FEELING_VALUES.map((feeling) => {
        const isSelected = value === feeling;

        return (
          <button
            key={feeling}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(feeling)}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={cn(
                "size-16 rounded-full bg-fill-neutral-normal-default",
                isSelected && "bg-fill-brand-subtle-default_2"
              )}
            />
            <span
              className={cn(
                "text-body2-medium text-layout-body-default",
                isSelected && "text-brand-strongUseThis-default"
              )}
            >
              {t(`feelings.${feeling}`)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ReviewFeelingSelect;
