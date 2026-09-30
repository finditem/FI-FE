"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import type { IconName } from "@/components/common";
import { cn } from "@/utils";

export type ReviewFeelingValue = "touched" | "grateful" | "heartFlutter";

const FEELING_VALUES: ReviewFeelingValue[] = ["touched", "grateful", "heartFlutter"];

const FEELING_ICON: Record<ReviewFeelingValue, IconName> = {
  touched: "Touched",
  grateful: "Grateful",
  heartFlutter: "HeartFlutter",
};

interface ReviewFeelingSelectProps {
  value: ReviewFeelingValue | null;
  onChange: (value: ReviewFeelingValue) => void;
}

/**
 * 후기 작성 시 상대방과의 만남에서 느낀 감정을 하나 고르는 선택 UI입니다.
 *
 * @author suhyeon
 */
const ReviewFeelingSelect = ({ value, onChange }: ReviewFeelingSelectProps) => {
  const t = useTranslations("ReviewWritePage");

  return (
    <div className="flex gap-9" role="radiogroup" aria-label={t("feelingsAriaLabel")}>
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
                "size-[88px] rounded-full flex-center",
                isSelected
                  ? "border border-brand-normal-disabled bg-[#C2F1D4]/30"
                  : "bg-fill-neutralInversed-normal-default"
              )}
            >
              <Icon
                name={FEELING_ICON[feeling]}
                size={48}
                className={
                  isSelected ? "text-brand-strong-default" : "text-labelsVibrant-quaternary"
                }
              />
            </span>
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
