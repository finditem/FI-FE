/**
 * `string | null` 값을 안전하게 숫자로 변환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - `null`이거나 `Number()` 변환 결과가 `NaN`이면 `fallback`을 반환합니다.
 * - 빈 문자열(`""`)은 `NaN`이 아닌 `0`으로 처리되므로 `fallback`을 반환하지 않습니다.
 * - `useSearchParams` 등 URL 파라미터를 숫자 타입으로 파싱할 때 사용합니다.
 *
 * @param value - 변환할 문자열 또는 null
 * @param fallback - 변환 실패 시 반환할 기본값
 *
 * @returns 변환된 숫자 또는 fallback 값
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * parseNumber("37.5665", 0);   // 37.5665
 * parseNumber(null, 126.977);  // 126.977
 * parseNumber("abc", 1000);    // 1000
 * ```
 */

export const parseNumber = (value: string | null, fallback: number): number => {
  if (value === null) return fallback;

  const num = Number(value);
  return isNaN(num) ? fallback : num;
};
