/**
 * YmdDate 객체를 UI 표시용 문자열(YYYY.MM.DD)로 변환하는 유틸 함수입니다.
 *
 * @author suhyeon
 *
 * @param date - 연, 월, 일로 구성된 날짜 객체
 *
 * @returns YYYY.MM.DD 형식의 문자열
 */

/**
 * @example
 * formatYmdLabel({ year: 2026, month: 3, day: 5 })
 * // "2026.03.05"
 */

type YmdDate = {
  year: number;
  month: number;
  day: number;
};

export const formatYmdLabel = (date: YmdDate) => {
  return `${date.year}.${String(date.month).padStart(2, "0")}.${String(date.day).padStart(2, "0")}`;
};
