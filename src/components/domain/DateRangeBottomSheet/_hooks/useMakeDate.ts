/**
 * 날짜 선택 UI에서 사용할 연/월/일 상태와 선택 핸들러를 생성하는 커스텀 훅입니다.
 *
 * @remarks
 * - 선택 가능한 연도는 2025년부터 현재 연도까지 제공됩니다.
 * - 현재 날짜 이후의 미래 날짜는 선택할 수 없도록 연/월/일 목록이 동적으로 필터링됩니다.
 * - 월(Month)이나 연(Year)이 변경될 때, 해당 월의 최대 일수를 계산하여 일(Day) 상태를 자동으로 보정합니다.
 *
 * @param queryDate - 초기값으로 설정할 날짜 객체
 *
 * @returns 날짜 선택에 필요한 상태와 핸들러 객체
 * - `years`: 선택 가능한 연도 배열 (2025 ~ 현재)
 * - `months`: 선택 가능한 월 배열 (현재 연도인 경우 현재 월까지만 표시)
 * - `days`: 선택 가능한 일 배열 (현재 월인 경우 현재 일까지만 표시)
 * - `selectDate`: 현재 선택된 { year, month, day } 상태
 * - `handleDateChange`: 특정 항목(year, month, day)을 변경하는 핸들러
 * - `handleResetDate`: 날짜를 현재 시점(오늘)으로 초기화하는 핸들러
 *
 * @author suhyeon
 */

/**
 * @example
 * ```tsx
 * const {
 * years,
 * months,
 * days,
 * selectDate,
 * handleDateChange,
 * handleResetDate,
 * } = useMakeDate({ year: 2025, month: 5, day: 10 });
 * ```
 */

import { getDaysInMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";

const useMakeDate = (queryDate?: { year: number; month: number; day: number }) => {
  const today = new Date();
  const startYear = 2025;

  // 현재 날짜
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  const [selectDate, setSelectDate] = useState(
    queryDate ?? { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
  );

  useEffect(() => {
    if (!queryDate) return;

    const isDifferent =
      selectDate.year !== queryDate.year ||
      selectDate.month !== queryDate.month ||
      selectDate.day !== queryDate.day;

    if (isDifferent) {
      setSelectDate(queryDate);
    }

    setSelectDate((prev) =>
      prev.year === queryDate.year && prev.month === queryDate.month && prev.day === queryDate.day
        ? prev
        : queryDate
    );
  }, [queryDate?.year, queryDate?.month, queryDate?.day]);

  // 날짜 배열 (년, 월, 일)
  const years = Array.from(
    { length: today.getFullYear() - startYear + 1 },
    (_, i) => startYear + i
  );

  const months = useMemo(() => {
    const isYearMax = selectDate.year === currentYear;
    const length = isYearMax ? currentMonth : 12;
    return Array.from({ length }, (_, i) => i + 1);
  }, [selectDate.year, currentMonth, currentYear]);

  const days = useMemo(() => {
    const isYearMax = selectDate.year === currentYear;
    const isMonthMax = selectDate.month === currentMonth;

    const date = new Date(selectDate.year, selectDate.month - 1);
    const maxDaysInMonth = getDaysInMonth(date);

    const length = isYearMax && isMonthMax ? currentDate : maxDaysInMonth;
    return Array.from({ length }, (_, i) => i + 1);
  }, [selectDate.year, selectDate.month, currentYear, currentMonth, currentDate]);

  const handleDateChange = (type: "year" | "month" | "day", value: number) => {
    setSelectDate((prev) => {
      const newDateArray = { ...prev, [type]: value };

      if (type !== "day") {
        const maxDay = getDaysInMonth(new Date(newDateArray.year, newDateArray.month - 1));
        if (newDateArray.day > maxDay) {
          newDateArray.day = maxDay;
        }
      }
      return newDateArray;
    });
  };

  const handleResetDate = () => {
    setSelectDate({ year: currentYear, month: currentMonth, day: currentDate });
  };

  return {
    years,
    months,
    days,
    selectDate,
    handleDateChange,
    handleResetDate,
  };
};

export default useMakeDate;
