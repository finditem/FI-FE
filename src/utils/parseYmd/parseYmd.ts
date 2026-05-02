/**
 * YYYY-MM-DD 형식의 날짜 문자열을 `{ year, month, day }` 객체로 변환하는 파싱 유틸리티입니다.
 *
 * @remarks
 * - URL 쿼리 스트링 등으로 전달받은 문자열 기반 날짜 데이터를 다룰 때 사용합니다.
 * - `YYYY-MM-DD` 및 `YYYY-M-D` 형식을 모두 지원합니다.
 * - 단순 정규식 검사 외에도 월(1~12), 일(1~31)의 산술적 범위를 추가로 검증합니다.
 * - 입력값이 없거나 형식이 유효하지 않은 경우 안전하게 `null`을 반환합니다.
 *
 * @param originQueryDate - 파싱할 날짜 문자열 (ex: "2026-04-23")
 *
 * @returns 파싱된 날짜 객체 또는 유효하지 않을 경우 null
 * - `year`: 연도 (number)
 * - `month`: 월 (1~12, number)
 * - `day`: 일 (1~31, number)
 *
 * @author suhyeon
 */

/**
 * @example
 * ```ts
 * // 1. 정상적인 케이스
 * parseYmd("2026-03-05");
 * // { year: 2026, month: 3, day: 5 }
 *
 * // 2. 한 자리 월/일 지원
 * parseYmd("2026-1-2");
 * // { year: 2026, month: 1, day: 2 }
 *
 * // 3. 유효하지 않은 형식 (null 반환)
 * parseYmd("2026/03/05"); // null
 * parseYmd("invalid-date"); // null
 *
 * // 4. 범위를 벗어난 날짜 (null 반환)
 * parseYmd("2026-13-40"); // null
 * ```
 */

export const parseYmd = (originQueryDate: string | null) => {
  if (!originQueryDate) return null;

  const DateArray = originQueryDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!DateArray) return null;

  const year = Number(DateArray[1]);
  const month = Number(DateArray[2]);
  const day = Number(DateArray[3]);

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
};
