import { formatYmd } from "@/utils";

/**
 * `Date`를 폼과 서버에 쓰는 `YYYY-MM-DD` 문자열로 만드는 유틸 함수입니다.
 *
 * @remarks
 * - 전역 `formatYmd`는 `{ year, month, day }` 객체를 받습니다. `Date`를 다루는 자리마다 풀어 쓰지 않으려고 감쌌습니다.
 * - 로컬 시간대 기준입니다. `toISOString()`은 UTC로 밀려 하루가 어긋날 수 있어 쓰지 않습니다.
 *
 * @param date - 변환할 `Date`
 *
 * @returns 예: `2026-08-22`
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * formatDateToYmd(new Date(2026, 7, 22));
 * // "2026-08-22"
 * ```
 */

export const formatDateToYmd = (date: Date) =>
  formatYmd({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
