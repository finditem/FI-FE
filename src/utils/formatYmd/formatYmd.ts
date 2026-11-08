/**
 * 연·월·일을 `YYYY-MM-DD` 문자열로 만드는 유틸 함수입니다.
 *
 * @remarks
 * - `parseYmd`의 역방향입니다. 쿼리 파라미터와 폼 값에 쓰는 날짜 표기를 맞춥니다.
 * - 화면에 보여줄 `2026.03.05` 형태가 필요하면 `formatYmdLabel`을 사용하세요.
 *
 * @param date - `{ year, month, day }` 객체
 *
 * @returns 예: `2026-03-05`
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * formatYmd({ year: 2026, month: 3, day: 5 });
 * // "2026-03-05"
 * ```
 */

type YmdDate = {
  year: number;
  month: number;
  day: number;
};

export const formatYmd = (date: YmdDate) => {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
};
