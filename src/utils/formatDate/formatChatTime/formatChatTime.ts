import { parseDateString } from "../parseDateString/parseDateString";

/**
 * 날짜·시간 문자열을 채팅 UI용 `HH:mm` 한 줄 표시로 바꿉니다.
 *
 * @remarks
 * - 내부에서 `parseDateString`으로 `Date`를 만든 뒤, 로컬 시·분을 사용합니다. (Z가 붙은 ISO는 먼저 UTC 등으로 풀린 뒤 로컬 시각으로 변환)
 * - 파싱 실패 시 빈 문자열을 반환합니다.
 *
 * @param date - ISO 8601 등 `parseDateString`이 이해하는 문자열
 *
 * @returns `HH:mm` (예: `09:05`). 실패 시 빈 문자열
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * formatChatTime("2025-02-09T14:30:00Z");
 * formatChatTime("2025-02-09T09:05:00");
 * ```
 */

const formatChatTime = (date: string): string => {
  const targetDate = parseDateString(date);
  if (!targetDate) {
    return "";
  }

  const hours = String(targetDate.getHours()).padStart(2, "0");
  const minutes = String(targetDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default formatChatTime;
