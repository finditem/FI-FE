import { addDays, startOfMonth, startOfWeek } from "date-fns";

/**
 * 월 그리드 달력에 그릴 6주 × 7일 날짜 배열을 만드는 유틸 함수입니다.
 *
 * @remarks
 * - 주는 일요일에 시작합니다.
 * - 첫 주와 마지막 주에는 앞뒤 달의 날짜가 섞입니다. 어느 달인지는 `getMonth()`로 구분하세요.
 * - 월 길이와 무관하게 항상 6주를 반환하므로 달을 넘겨도 그리드 높이가 흔들리지 않습니다.
 *
 * @param year - 연도 (예: 2026)
 * @param month - 1부터 시작하는 월 (예: 3)
 *
 * @returns 길이 6의 주 배열. 각 주는 길이 7의 `Date` 배열입니다.
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * const weeks = buildCalendarWeeks(2026, 7);
 * // weeks[0][0] → 2026-06-28 (일요일)
 * ```
 */

const WEEKS_IN_CALENDAR = 6;
const DAYS_IN_WEEK = 7;

export const buildCalendarWeeks = (year: number, month: number): Date[][] => {
  const firstCell = startOfWeek(startOfMonth(new Date(year, month - 1, 1)), { weekStartsOn: 0 });

  return Array.from({ length: WEEKS_IN_CALENDAR }, (_, week) =>
    Array.from({ length: DAYS_IN_WEEK }, (_, day) => addDays(firstCell, week * DAYS_IN_WEEK + day))
  );
};
