import { parseDateString } from "@/utils/formatDate/parseDateString/parseDateString";
import { formatDateToYmd } from "../formatDateToYmd/formatDateToYmd";

/**
 * 폼에 저장된 날짜를 서버가 요구하는 로컬 날짜·시간 문자열로 만드는 유틸 함수입니다.
 *
 * @remarks
 * - 반환 형식은 타임존 표기가 없는 ISO 8601 `YYYY-MM-DDTHH:mm:ss`입니다. `toISOString()`은 `Z`가 붙은 UTC라 쓸 수 없습니다.
 * - 날짜만 고르는 UI라서 시·분·초는 `now`에서 가져옵니다. 같은 날 올라온 글끼리 정렬 순서를 만들기 위한 값입니다.
 * - 폼 값은 작성 화면에서 `YYYY-MM-DD`, 수정 화면에서 ISO 문자열로 들어오므로 두 형식을 모두 읽습니다.
 * - 날짜를 읽을 수 없으면 `now`의 날짜를 씁니다. `postWriteSubmitSchema`가 빈 값을 막으므로 정상 흐름에서는 일어나지 않습니다.
 *
 * @param formDate - 폼 `date` 필드의 값
 * @param now - 시·분·초를 가져올 기준 시각 (default: 호출 시점)
 *
 * @returns 예: `2026-08-22T14:30:05`
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * buildPostDateTime("2026-08-22", new Date(2026, 7, 23, 14, 30, 5));
 * // "2026-08-22T14:30:05"
 * ```
 */

const padTwoDigits = (value: number) => String(value).padStart(2, "0");

export const buildPostDateTime = (formDate: string, now: Date = new Date()): string => {
  const selected = parseDateString(formDate) ?? now;

  const date = formatDateToYmd(selected);
  const time = `${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}:${padTwoDigits(now.getSeconds())}`;

  return `${date}T${time}`;
};
