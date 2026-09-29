"use client";

import { useTranslations } from "next-intl";
import { CheckBox } from "@/components/common";

export type ReviewHelpItemValue =
  "kind" | "trustworthy" | "quickResponse" | "safeKeeping" | "helpfulInfo";

const HELP_ITEM_VALUES: ReviewHelpItemValue[] = [
  "kind",
  "trustworthy",
  "quickResponse",
  "safeKeeping",
  "helpfulInfo",
];

interface ReviewHelpChecklistProps {
  value: ReviewHelpItemValue[];
  onChange: (value: ReviewHelpItemValue[]) => void;
}

/**
 * 후기 작성 시 상대방에게 어떤 도움을 받았는지 다중 선택하는 체크리스트입니다.
 *
 * @author suhyeon
 */
const ReviewHelpChecklist = ({ value, onChange }: ReviewHelpChecklistProps) => {
  const t = useTranslations("ReviewWritePage");

  const toggleItem = (item: ReviewHelpItemValue) => {
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);
  };

  return (
    <div className="flex flex-col gap-3">
      {HELP_ITEM_VALUES.map((item) => (
        <CheckBox
          key={item}
          id={`review-help-${item}`}
          label={t(`helpItems.${item}`)}
          checked={value.includes(item)}
          onChange={() => toggleItem(item)}
          textStyle="peer-checked:!text-brand-normal-default"
        />
      ))}
    </div>
  );
};

export default ReviewHelpChecklist;
