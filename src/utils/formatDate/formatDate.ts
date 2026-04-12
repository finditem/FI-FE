import { parseDateString } from "./parseDateString";

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

/**
 * @author hyungjun
 *
 * @description
 * ISO 8601 등 날짜 문자열을 상대 시간 또는 날짜 문자열로 포맷팅하는 함수입니다.
 * 현재 시각 기준으로 '지금', 'N분 전', 'N시간 전', '어제', 또는 'YYYY.MM.DD' 형식으로 반환합니다.
 *
 * @param date - ISO 8601 형식 또는 파싱 가능한 날짜 문자열 (타임존 없으면 로컬 시간으로 해석)
 * @returns 상대 시간 문자열 또는 'YYYY.MM.DD' 형식의 날짜 문자열. 파싱 실패 시 빈 문자열
 *
 * @example
 * formatDate(new Date().toISOString()); // "지금"
 * formatDate("2025-02-09T00:00:00Z"); // "N분 전" 또는 "N시간 전" 등
 * formatDate("2025-02-08T12:00:00"); // "어제" 또는 "2025.02.08"
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
 * Date 객체를 'YYYY.MM.DD' 형식 문자열로 변환합니다.
 *
 * @param date - 변환할 Date 객체
 * @returns 'YYYY.MM.DD' 형식 문자열
 */
const buildDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export default formatDate;
