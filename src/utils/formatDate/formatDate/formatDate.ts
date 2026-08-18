import { parseDateString } from "../parseDateString/parseDateString";

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

export interface RelativeDateLabels {
  now: string;
  minutesAgo: (minutes: number) => string;
  hoursAgo: (hours: number) => string;
  yesterday: string;
}

const defaultLabels: RelativeDateLabels = {
  now: "지금",
  minutesAgo: (minutes) => `${minutes}분 전`,
  hoursAgo: (hours) => `${hours}시간 전`,
  yesterday: "어제",
};

/**
 * ISO 등 날짜 문자열을 현재 시각 기준 상대/절대 라벨로 만듭니다.
 *
 * @remarks
 * - `지금`(now) / `N분 전`(minutesAgo) / `N시간 전`(hoursAgo) / `어제`(yesterday) / `YYYY.MM.DD` 중 하나를 골라 반환합니다. (임계값은 `MS_IN_MINUTE`, `MS_IN_HOUR`, `MS_IN_DAY` 기준)
 * - `labels`를 넘기지 않으면 기존 한국어 라벨을 그대로 사용합니다. 다국어가 필요한 화면은 `useFormatDate` 훅을 사용하세요.
 * - 미래 시각이면 상대 대신 `YYYY.MM.DD`로 고정해 표시합니다.
 * - 2일 이상 지난 날짜는 `YYYY.MM.DD`입니다. (`buildDateString` 사용)
 * - 파싱 실패 시 빈 문자열입니다.
 * - `new Date()`로 “지금”을 잡으므로 테스트에서는 `jest.setSystemTime` 등으로 기준 시각을 고정하는 것이 좋습니다.
 *
 * @param date - `parseDateString`에 맡길 수 있는 날짜 문자열
 * @param labels - 상대 시간 라벨 (미지정 시 한국어 기본값)
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

const formatDate = (date: string, labels: RelativeDateLabels = defaultLabels) => {
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
    return labels.now;
  }

  if (diffMs < MS_IN_HOUR) {
    const minutesAgo = Math.max(1, Math.floor(diffMs / MS_IN_MINUTE));
    return labels.minutesAgo(minutesAgo);
  }

  if (diffMs < MS_IN_DAY) {
    const hoursAgo = Math.floor(diffMs / MS_IN_HOUR);
    return labels.hoursAgo(hoursAgo);
  }

  const diffDays = Math.floor(diffMs / MS_IN_DAY);
  if (diffDays === 1) {
    return labels.yesterday;
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
