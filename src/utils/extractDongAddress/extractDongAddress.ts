/**
 * 주소 문자열에서 `…동` 형태의 행정동·법정동 토큰을 추출합니다.
 *
 * @remarks
 * - 공백으로 토큰을 나눈 뒤, 뒤에서부터 `동`으로 끝나는 첫 토큰을 반환합니다. (카카오 좌표→주소 표기와 유사한 규칙)
 * - 빈 문자열·공백만 있는 입력은 빈 문자열을 반환합니다.
 * - `동`으로 끝나는 토큰이 없으면 빈 문자열을 반환합니다.
 *
 * @param address - 원본 주소 문자열
 *
 * @returns 추출된 동 이름(예: `역삼동`). 해당 토큰이 없으면 빈 문자열
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * // 1. 일반 주소
 * extractDongAddress("서울특별시 강남구 역삼동 123-45");
 * // => "역삼동"
 *
 * // 2. 동 토큰이 없는 경우
 * extractDongAddress("서울특별시 강남구 테헤란로 123");
 * // => ""
 *
 * // 3. 빈 입력
 * extractDongAddress("");
 * // => ""
 * ```
 */

export const extractDongAddress = (address: string): string => {
  if (!address) return "";
  const segments = address.split(" ").filter(Boolean);
  const dongSegment = segments.findLast((segment) => segment.endsWith("동"));
  return dongSegment ?? "";
};
