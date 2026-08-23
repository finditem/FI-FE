"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Icon, RequiredText } from "@/components";
import { cn, parseYmd } from "@/utils";
import { parseDateString } from "@/utils/formatDate/parseDateString/parseDateString";
import { PostWriteFormValues } from "../../../_types/PostWriteType";
import { formatDateToYmd } from "../../../_utils/formatDateToYmd/formatDateToYmd";
import DatePickerModal from "./_internal/DatePickerModal/DatePickerModal";

/**
 * 분실·습득 날짜를 고르는 폼 섹션입니다.
 *
 * @remarks
 * - 폼의 `date` 필드를 `YYYY-MM-DD`로 저장합니다.
 * - 수정 화면은 `date`가 ISO 문자열로 들어오므로 두 형식을 모두 읽습니다.
 * - 값이 없을 때는 오늘 날짜를 안내로 보여줍니다. 폼 값은 여전히 비어 있어 `postWriteSubmitSchema`가 제출을 막습니다.
 *
 * @author jikwon
 */

/** 폼에 저장된 문자열을 `Date`로 되돌립니다. 작성 화면은 `YYYY-MM-DD`, 수정 화면은 ISO 문자열입니다. */
const toDate = (value: string): Date | null => {
  const ymd = parseYmd(value);
  if (ymd) return new Date(ymd.year, ymd.month - 1, ymd.day);

  return parseDateString(value);
};

const DateSection = () => {
  const t = useTranslations("DateSection");
  const { control, setValue } = useFormContext<PostWriteFormValues>();
  const date = useWatch({ control, name: "date" });

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const selectedDate = date ? toDate(date) : null;
  const displayValue = selectedDate ? formatDateToYmd(selectedDate) : "";
  // 고른 값이 아니라 안내이므로 time이 아닌 span으로 두고 placeholder 색을 유지합니다.
  const placeholderValue = formatDateToYmd(new Date());

  const handleSelectDate = (nextDate: Date) => {
    setValue("date", formatDateToYmd(nextDate), { shouldDirty: true, shouldValidate: true });
  };

  return (
    <section className="flex flex-col gap-[15px] border-b border-flatGray-50 px-5 py-6">
      <div className="flex">
        <p id="date-label" className="text-body1-medium text-neutral-normal-placeholder">
          {t("label")}
        </p>{" "}
        <RequiredText />
      </div>
      <button
        type="button"
        onClick={() => setIsPickerOpen(true)}
        aria-labelledby="date-label date-value"
        className={cn(
          // 날짜가 있으면 아이콘과 글자가 함께 진해집니다. Calendar 아이콘이 currentColor를 따릅니다.
          "flex h-11 w-full cursor-pointer items-center justify-between rounded-[10px] px-2 text-body1-medium",
          "bg-fill-neutral-strong-enteredSelected",
          selectedDate ? "text-labelsVibrant-primary" : "text-neutral-normal-placeholder"
        )}
      >
        {selectedDate ? (
          <time id="date-value" dateTime={displayValue}>
            {displayValue}
          </time>
        ) : (
          <span id="date-value">{placeholderValue}</span>
        )}
        <Icon name="WriteCalendar" size={24} />
      </button>

      <DatePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedDate={selectedDate}
        onSelect={handleSelectDate}
      />
    </section>
  );
};

export default DateSection;
