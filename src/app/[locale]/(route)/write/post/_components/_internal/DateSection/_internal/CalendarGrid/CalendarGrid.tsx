"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { buildCalendarWeeks } from "../../../../../_utils/buildCalendarWeeks/buildCalendarWeeks";

/**
 * 한 달치 날짜를 7열 그리드로 그리는 컴포넌트입니다.
 *
 * @remarks
 * - 앞뒤 달의 날짜와 `maxDate` 이후의 날짜는 흐리게 표시하고 `disabled`로 클릭을 막습니다.
 * - 칸 크기와 색은 Figma의 `popup_cal`(13385:134201) 값을 따릅니다.
 *
 * @author jikwon
 */

interface CalendarGridProps {
  /** 화면에 그릴 연도 */
  year: number;
  /** 화면에 그릴 월 (1부터 시작) */
  month: number;
  /** 선택된 날짜. 없으면 아무 날짜도 강조하지 않습니다. */
  selectedDate: Date | null;
  /** 선택 가능한 마지막 날짜 */
  maxDate: Date;
  /** 날짜 선택 핸들러 */
  onSelectDate: (date: Date) => void;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const CalendarGrid = ({ year, month, selectedDate, maxDate, onSelectDate }: CalendarGridProps) => {
  const t = useTranslations("DatePickerModal");
  const weekdays = t.raw("weekdaysShort") as string[];
  const weeks = buildCalendarWeeks(year, month);

  return (
    <div role="grid" aria-label={t("gridLabel")} className="flex flex-col gap-1">
      <div role="row" className="flex items-center gap-1">
        {weekdays.map((weekday) => (
          <span
            key={weekday}
            role="columnheader"
            className="size-10 text-body2-semibold text-labelsVibrant-secondary flex-center"
          >
            {weekday}
          </span>
        ))}
      </div>

      {weeks.map((week) => (
        <div role="row" key={week[0].toISOString()} className="flex items-center gap-1">
          {week.map((date) => {
            const isOutsideMonth = date.getMonth() !== month - 1;
            // 앞뒤 달 날짜는 흐리게 보이기만 하는 것이 아니라 실제로도 누르지 못하게 막습니다.
            // 막지 않으면 2025년 1월 달력의 2024년 12월 칸을 눌러 하한을 넘길 수 있습니다.
            const isDisabled = isOutsideMonth || date > maxDate;
            const isSelected = selectedDate !== null && isSameDay(date, selectedDate);

            return (
              <span role="gridcell" key={date.toISOString()}>
                <button
                  type="button"
                  disabled={isDisabled}
                  aria-current={isSelected ? "date" : undefined}
                  aria-label={t("dayLabel", {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                  })}
                  onClick={() => onSelectDate(date)}
                  className={cn(
                    "size-10 rounded-[10px] transition-colors flex-center",
                    isDisabled && "cursor-not-allowed",
                    isSelected
                      ? "text-body2-semibold text-brand-strongUseThis-default bg-fill-brand-subtle-default"
                      : cn(
                          "text-body2-medium",
                          isDisabled ? "text-labelsVibrant-secondary" : "text-layout-header-default"
                        )
                  )}
                >
                  {date.getDate()}
                </button>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
