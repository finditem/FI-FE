import { parseDateString } from "./parseDateString";

/**
 * @author hyungjun
 *
 * ISO 문자열을 로컬 타임존(한국이면 KST) 기준 연·월·일·요일로 파싱합니다.
 * formatDate 유틸과 동일하게, 타임존이 없으면 로컬 시간으로 해석합니다.
 *
 * @param isoString - ISO 8601 형식 또는 파싱 가능한 날짜 문자열
 * @returns year, month, date, day (0=일요일)
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
 *  @author hyungjun
 *
 * @description
 * ISO 날짜 문자열을 한국어 날짜 형식('YYYY.MM.DD 요일')으로 포맷팅합니다.
 * 로컬 타임존(한국이면 KST) 기준으로 계산합니다.
 *
 * @param isoString - ISO 8601 형식 또는 파싱 가능한 날짜 문자열
 * @returns 'YYYY.MM.DD 요일' 형식 문자열 (예: "2025.02.09 일요일")
 *
 * @example
 * formatKoreanDate("2025-02-09T15:00:00Z"); // "2025.02.10 월요일" (KST 기준)
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
 * @author hyungjun
 *
 * @description
 * ISO 날짜 문자열에서 로컬 기준 날짜 구분용 키('YYYY-M-D')를 반환합니다.
 * 채팅 날짜 구분선 등에서 같은 날 묶음 판별에 사용합니다.
 *
 * @param isoString - ISO 8601 형식 또는 파싱 가능한 날짜 문자열
 * @returns 'YYYY-M-D' 형식 문자열 (month/date는 0 패딩 없음)
 *
 * @example
 * getDateKey("2025-02-09T12:00:00Z"); // "2025-1-9" (로컬 기준)
 */
export const getDateKey = (isoString: string) => {
  const dateInfo = getLocalDateInfo(isoString);
  if (!dateInfo) return "";
  const { year, month, date } = dateInfo;
  return `${year}-${month}-${date}`;
};
