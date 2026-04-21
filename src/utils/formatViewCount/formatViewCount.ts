/**
 * 게시글 조회수를 단위에 맞게 포맷팅하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 1,000 미만: 그대로 표기 (예: "999회")
 * - 1,000 이상 ~ 10,000 미만: 천 단위, 소수점 한 자리 (예: "1.2천회")
 * - 10,000 이상 ~ 1,000,000 미만: 만 단위, 소수점 한 자리 (예: "1.2만회")
 * - 1,000,000 이상: 만 단위 절삭 정수 (예: "100만회")
 *
 * @param count - 조회수
 *
 * @returns 포맷팅된 조회수 문자열
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * formatViewCount(999);    // "999회"
 * formatViewCount(1234);   // "1.2천회"
 * formatViewCount(12345);  // "1.2만회"
 * formatViewCount(123456); // "12.3만회"
 * ```
 */

export const formatViewCount = (count: number): string => {
  if (count < 1_000) {
    return `${count}회`;
  }

  if (count < 10_000) {
    const value = count / 1_000;
    return `${Number.isInteger(value) ? value : value.toFixed(1)}천회`;
  }

  if (count < 1_000_000) {
    const value = count / 10_000;
    return `${Number.isInteger(value) ? value : value.toFixed(1)}만회`;
  }

  const value = Math.floor(count / 10_000);
  return `${value}만회`;
};
