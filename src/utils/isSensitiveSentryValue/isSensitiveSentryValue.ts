/**
 * 키 이름이 평범해도 값 자체가 자격 증명처럼 보이면 가립니다. JWT와 Bearer 토큰입니다.
 * HTTP 인증 방식 이름은 대소문자를 구분하지 않으므로 Bearer는 `i` 플래그로 따로 검사합니다.
 */
const JWT_RE = /eyJ[\w-]{6,}\.[\w-]{6,}/;
const BEARER_RE = /\bbearer\s+[\w.-]+/i;

/**
 * 문자열 값이 JWT나 Bearer 토큰처럼 보이는지 판별하는 유틸 함수입니다.
 *
 * @remarks
 * - Sentry 이벤트와 스팬 마스킹이 키 이름과 별개로 값의 모양을 검사할 때 씁니다.
 * - 문자열 일부에만 토큰이 섞여 있어도 `true`를 돌려주므로, 호출하는 쪽은 값을 통째로 가립니다.
 *
 * @param value - 검사할 문자열
 *
 * @returns 자격 증명으로 보이면 `true`
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * isSensitiveSentryValue("Bearer abc.def"); // true
 * isSensitiveSentryValue("/list/1"); // false
 * ```
 */
export const isSensitiveSentryValue = (value: string) =>
  JWT_RE.test(value) || BEARER_RE.test(value);
