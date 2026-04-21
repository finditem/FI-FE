/**
 * 전달된 문자열을 enum value로 사용하기 적합한 형태(대문자)로 정규화하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 단순히 대문자로 변환하므로, 실제 enum에 존재하는 값인지는 별도로 검증해야 합니다.
 *
 * @param value - search params로 전달된 문자열
 *
 * @returns 대문자로 변환된 enum value, 값이 없으면 undefined
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * normalizeEnumValue("most_viewed"); // "MOST_VIEWED"
 * normalizeEnumValue("latest");      // "LATEST"
 * normalizeEnumValue(null);          // undefined
 *
 * // enum과 함께 사용
 * type SortType = "LATEST" | "MOST_VIEWED";
 * const sort = normalizeEnumValue<SortType>(searchParams.get("sort"));
 * ```
 */

export const normalizeEnumValue = <T extends string>(value?: string | null): T | undefined => {
  if (!value) return undefined;

  return value.toUpperCase() as T;
};
