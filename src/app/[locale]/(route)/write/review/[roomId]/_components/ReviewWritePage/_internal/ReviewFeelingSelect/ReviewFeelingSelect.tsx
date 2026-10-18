"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import type { ReviewFeelingValue } from "../../../../_types/ReviewFeelingValue";

const FEELING_VALUES: ReviewFeelingValue[] = ["touched", "grateful", "heartFlutter"];

const FEELING_IMAGE: Record<ReviewFeelingValue, { default: string; selected: string }> = {
  touched: {
    default: "/review/feeling/touched-default.webp",
    selected: "/review/feeling/touched-selected.webp",
  },
  grateful: {
    default: "/review/feeling/grateful-default.webp",
    selected: "/review/feeling/grateful-selected.webp",
  },
  heartFlutter: {
    default: "/review/feeling/heart-flutter-default.webp",
    selected: "/review/feeling/heart-flutter-selected.webp",
  },
};

interface ReviewFeelingSelectProps {
  value: ReviewFeelingValue | null;
  onChange: (value: ReviewFeelingValue) => void;
}

/**
 * 후기 작성 시 상대방과의 만남에서 느낀 감정을 하나 고르는 선택 UI입니다.
 *
 * @remarks
 * 감정별로 미선택(흑백)과 선택(컬러) 일러스트가 별도 이미지로 제공되어, 선택 상태에 따라
 * 이미지 소스 자체를 교체합니다. CSS 채도 필터는 쓰지 않습니다.
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
                  ? "bg-fill-brand-normal-default"
                  : "bg-fill-neutralInversed-normal-default"
              )}
            >
              <Image
                src={isSelected ? FEELING_IMAGE[feeling].selected : FEELING_IMAGE[feeling].default}
                alt=""
                width={45}
                height={60}
                className="h-[60px] w-auto"
              />
            </span>
            <span
              className={cn(
                "text-body2-medium",
                isSelected ? "text-brand-normal-default" : "text-labelsVibrant-secondary"
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
