import { parseDateString } from "../parseDateString/parseDateString";

/**
 * ISO 등 문자열을 로컬(실행 환경 타임존)의 연·월·일·요일로 풀어옵니다. (`formatKoreanDate` / `getDateKey` 내부용)
 */

const getLocalDateInfo = (isoString: string) => {
  const targetDate = parseDateString(isoString);
  if (!targetDate) {
    return null;
  }

  return {
    year: targetDate.getFullYear(),
    month: targetDate.getMonth(),
    date: targetDate.getDate(),
    day: targetDate.getDay(),
  };
};

/**
 * ISO 날짜 문자열을 `YYYY.MM.DD 요일` 형식(한국어 요일)으로 포맷합니다.
 *
 * @remarks
 * - `getLocalDateInfo` → 로컬 달력 기준 `년·월·일·getDay()`를 사용합니다. Z가 붙은 문자열이면 먼저 UTC로 파싱된 뒤 로컬로 변환되므로, 표기 일자·요일은 타임존에 따라 달라질 수 있습니다.
 * - 파싱 실패 시 빈 문자열입니다.
 *
 * @param isoString - `parseDateString`에 맡길 수 있는 문자열
 *
 * @returns 예: `2025.02.09 일요일`. 실패 시 빈 문자열
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * formatKoreanDate("2025-02-09T15:00:00Z");
 * ```
 */

export const formatKoreanDate = (isoString: string) => {
  const dateInfo = getLocalDateInfo(isoString);
  if (!dateInfo) return "";
  const { year, month, date, day } = dateInfo;

  const monthStr = String(month + 1).padStart(2, "0");
  const dateStr = String(date).padStart(2, "0");

  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weekday = weekdays[day];

  return `${year}.${monthStr}.${dateStr} ${weekday}`;
};

/**
 * ISO 날짜 문자열을 **로컬** 날짜 기준 `YYYY-M-D` 키로 돌려줍니다. (0 패딩 없음, `month`는 `0`~`11`과 동일)
 *
 * @remarks
 * - 채팅 ‘날짜 구분선’ 등 같은 로컬 일자끼리 묶는 데 쓰기 좋게 `getMonth`/`getDate`를 그대로 이었습니다.
 * - 파싱 실패 시 빈 문자열입니다.
 *
 * @param isoString - `parseDateString`에 맡길 수 있는 문자열
 *
 * @returns `년-월-일` (월은 `Date#getMonth`와 같이 0~11, 앞에 0을 붙이지 않음). 실패 시 빈 문자열
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * getDateKey("2025-02-09T12:00:00Z");
 * ```
 */

export const getDateKey = (isoString: string) => {
  const dateInfo = getLocalDateInfo(isoString);
  if (!dateInfo) return "";
  const { year, month, date } = dateInfo;
  return `${year}-${month}-${date}`;
};
