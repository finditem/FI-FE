import { parseDateString } from "@/utils/formatDate/parseDateString/parseDateString";

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;

export interface PostDateLabels {
  /** 1시간 미만 */
  minutesAgo: (minutes: number) => string;
  /** 1시간 이상 1일 미만 */
  hoursAgo: (hours: number) => string;
  /** 1일 이상 7일 미만 */
  daysAgo: (days: number) => string;
  /** 7일 이상 30일 미만 */
  weeksAgo: (weeks: number) => string;
  /** 30일 이상 365일 미만 */
  monthsAgo: (months: number) => string;
  /** 365일 이상 */
  yearsAgo: (years: number) => string;
}

/**
 * 게시글 작성일시를 작성 시간 표기 정책에 맞는 경과 시간 라벨로 만듭니다.
 *
 * @remarks
 * - 기획 정책은 1시간 미만 `N분 전`, 1일 이상 7일 미만 `N일 전`, 7일 이상 30일 미만 `N주 전`, 12개월 미만 `N개월 전`, 1년 이상 `N년 전`입니다.
 * - 정책에 규정이 없어 이 함수가 정한 구간이 셋 있습니다. 1시간 이상 1일 미만은 `N시간 전`(기존 `formatDate`와 같은 처리), 1분 미만은 `1분 전`, 미래 시각은 서버와 클라이언트의 시계 차이로 보고 `1분 전`입니다.
 * - 개월은 30일, 연은 365일 기준이라 360일 이상 365일 미만 구간은 `12개월 전`으로 나옵니다.
 * - `formatDate`와 달리 절대 날짜(`YYYY.MM.DD`)로 넘어가는 구간이 없습니다. 오래된 글도 계속 상대 시간으로 보여주는 것이 정책입니다. 절대 날짜가 필요한 화면은 `formatDate`를 그대로 쓰세요.
 * - 이 함수는 구간만 나누고 문구는 갖지 않습니다. 화면에서 쓸 때는 `useFormatPostDate` 훅을 쓰세요. 훅이 `PostDetailBody` 네임스페이스의 번역을 라벨로 넘겨줍니다.
 * - 파싱에 실패하면 빈 문자열입니다.
 * - `new Date()`로 현재 시각을 잡으므로 테스트에서는 `jest.setSystemTime`으로 기준 시각을 고정하세요.
 *
 * @param date - `parseDateString`이 읽을 수 있는 날짜 문자열 (게시글 `createdAt`)
 * @param labels - 구간별 라벨
 *
 * @returns 경과 시간 라벨 또는 빈 문자열
 *
 * @author jikwon
 */
/**
 * @example
 * ```ts
 * const formatPostDate = useFormatPostDate();
 * formatPostDate("2026-09-27T11:30:00"); // 결과: "30분 전"
 * ```
 */
export const formatPostDate = (date: string, labels: PostDateLabels) => {
  const targetDate = parseDateString(date);
  if (!targetDate) {
    return "";
  }

  const diffMs = Math.max(0, new Date().getTime() - targetDate.getTime());

  if (diffMs < MS_IN_HOUR) {
    return labels.minutesAgo(Math.max(1, Math.floor(diffMs / MS_IN_MINUTE)));
  }

  if (diffMs < MS_IN_DAY) {
    return labels.hoursAgo(Math.floor(diffMs / MS_IN_HOUR));
  }

  const diffDays = Math.floor(diffMs / MS_IN_DAY);

  if (diffDays < DAYS_IN_WEEK) {
    return labels.daysAgo(diffDays);
  }

  if (diffDays < DAYS_IN_MONTH) {
    return labels.weeksAgo(Math.floor(diffDays / DAYS_IN_WEEK));
  }

  if (diffDays < DAYS_IN_YEAR) {
    return labels.monthsAgo(Math.floor(diffDays / DAYS_IN_MONTH));
  }

  return labels.yearsAgo(Math.floor(diffDays / DAYS_IN_YEAR));
};
