"use client";

import { useTranslations } from "next-intl";
import { DateWheel } from "@/components/common";

/**
 * 연·월을 한 줄로 합쳐 굴려 고르는 휠입니다.
 *
 * @remarks
 * - 시안(13385:146071)이 `2026년 8월`처럼 한 줄에 연과 월을 함께 보여주므로 휠은 하나입니다.
 * - 휠 값은 `연 * 12 + (월 - 1)`로 만든 월 일련번호입니다. 이렇게 하면 해를 넘겨도 목록이 이어집니다.
 * - `minYear` 1월부터 `maxDate`가 속한 달까지만 고를 수 있습니다.
 *
 * @author jikwon
 */

/** 연·월을 월 일련번호로 만듭니다. */
const toMonthValue = (year: number, month: number) => year * 12 + (month - 1);

/** 월 일련번호를 연·월로 되돌립니다. */
const fromMonthValue = (value: number) => ({
  year: Math.floor(value / 12),
  month: (value % 12) + 1,
});

interface MonthWheelProps {
  /** 선택된 연도 */
  year: number;
  /** 선택된 월 (1부터 시작) */
  month: number;
  /** 선택 가능한 첫 연도 */
  minYear: number;
  /** 선택 가능한 마지막 날짜 */
  maxDate: Date;
  /** 연·월 변경 핸들러 */
  onChange: (next: { year: number; month: number }) => void;
}

const MonthWheel = ({ year, month, minYear, maxDate, onChange }: MonthWheelProps) => {
  const t = useTranslations("DatePickerModal");
  const monthLabels = t.raw("months") as string[];

  const firstValue = toMonthValue(minYear, 1);
  const lastValue = toMonthValue(maxDate.getFullYear(), maxDate.getMonth() + 1);
  const monthValues = Array.from(
    { length: lastValue - firstValue + 1 },
    (_, index) => firstValue + index
  );

  return (
    <DateWheel
      dateArray={monthValues}
      selected={toMonthValue(year, month)}
      onSelected={(value) => onChange(fromMonthValue(value))}
      renderLabel={(value) => {
        const target = fromMonthValue(value);
        return t("monthTitle", { year: target.year, month: monthLabels[target.month - 1] });
      }}
      variant="pill"
      ariaLabel={t("monthWheelLabel")}
    />
  );
};

export default MonthWheel;
