/**
 * 숫자를 상한값 기준으로 포맷팅하여 문자열로 반환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - `NaN`이 전달되면 `"0"`을 반환합니다.
 * - `cap`을 초과하면 `"cap+"` 형태로 표시됩니다.
 * - 그 외의 경우 미국식 천 단위 구분 기호(,)를 포함한 문자열로 반환됩니다.
 *
 * @param value - 포맷팅할 숫자 값
 * @param cap - 표시할 최대 숫자, 초과 시 `"cap+"` 형태로 표시 (default: 9,999)
 *
 * @returns 포맷된 숫자 문자열
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * formatCappedNumber(1234);      // "1,234"
 * formatCappedNumber(10000);     // "9,999+"
 * formatCappedNumber(1500, 999); // "999+"
 * formatCappedNumber(NaN);       // "0"
 * ```
 */

export const formatCappedNumber = (value: number, cap: number = 9999): string => {
  if (Number.isNaN(value)) return "0";

  if (value > cap) {
    return `${cap.toLocaleString("en-US")}+`;
  }

  return value.toLocaleString("en-US");
};
