import { parseDateString } from "../parseDateString/parseDateString";

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

/**
 * ISO 등 날짜 문자열을 현재 시각 기준 상대/절대 한국어형 라벨로 만듭니다.
 *
 * @remarks
 * - `지금` / `N분 전` / `N시간 전` / `어제` / `YYYY.MM.DD` 중 하나를 골라 반환합니다. (임계값은 `MS_IN_MINUTE`, `MS_IN_HOUR`, `MS_IN_DAY` 기준)
 * - 미래 시각이면 상대 대신 `YYYY.MM.DD`로 고정해 표시합니다.
 * - 2일 이상 지난 날짜는 `YYYY.MM.DD`입니다. (`buildDateString` 사용)
 * - 파싱 실패 시 빈 문자열입니다.
 * - `new Date()`로 “지금”을 잡으므로 테스트에서는 `jest.setSystemTime` 등으로 기준 시각을 고정하는 것이 좋습니다.
 *
 * @param date - `parseDateString`에 맡길 수 있는 날짜 문자열
 *
 * @returns 상대/절대 라벨 또는 빈 문자열
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * formatDate(new Date().toISOString());
 * formatDate("2025-02-08T12:00:00");
 * ```
 */

const formatDate = (date: string) => {
  const targetDate = parseDateString(date);
  if (!targetDate) {
    return "";
  }

  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();

  if (diffMs < 0) {
    return buildDateString(targetDate);
  }

  if (diffMs < MS_IN_MINUTE) {
    return "지금";
  }

  if (diffMs < MS_IN_HOUR) {
    const minutesAgo = Math.max(1, Math.floor(diffMs / MS_IN_MINUTE));
    return `${minutesAgo}분 전`;
  }

  if (diffMs < MS_IN_DAY) {
    const hoursAgo = Math.floor(diffMs / MS_IN_HOUR);
    return `${hoursAgo}시간 전`;
  }

  const diffDays = Math.floor(diffMs / MS_IN_DAY);
  if (diffDays === 1) {
    return "어제";
  }

  return buildDateString(targetDate);
};

/**
 * `Date`를 `YYYY.MM.DD` 문자열로 돌려줍니다. (`formatDate` 내부용)
 */
const buildDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export default formatDate;
