import { SENTRY_REDACTED } from "@/constants/SENTRY_SCRUB";

/** URL 쿼리에서 값을 가릴 파라미터입니다. OAuth 콜백의 일회용 값과 토큰류입니다. */
const SENSITIVE_QUERY_KEYS = ["code", "state", "token", "access_token", "refresh_token"];

/**
 * URL 문자열의 쿼리에서 OAuth 일회용 값과 토큰류 파라미터 값만 가리는 유틸 함수입니다.
 *
 * @remarks
 * - 경로와 나머지 쿼리는 원인 추적에 필요하므로 그대로 둡니다.
 * - `?`가 없거나 가릴 파라미터가 없으면 입력 문자열을 그대로 돌려줍니다. URL이 아닌 문자열에 넣어도 안전합니다.
 * - `#` 뒤의 해시는 건드리지 않습니다.
 *
 * @param url - 검사할 URL 또는 `GET /path?query` 같은 스팬 이름
 *
 * @returns 민감 파라미터 값을 `[Redacted]`로 바꾼 문자열
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * scrubSentryUrl("/auth/callback?code=abc&next=/"); // "/auth/callback?code=%5BRedacted%5D&next=%2F"
 * ```
 */
export const scrubSentryUrl = (url: string) => {
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) return url;

  const hashIndex = url.indexOf("#", queryIndex);
  const queryEnd = hashIndex === -1 ? url.length : hashIndex;
  const params = new URLSearchParams(url.slice(queryIndex + 1, queryEnd));

  let changed = false;
  for (const key of SENSITIVE_QUERY_KEYS) {
    if (params.has(key)) {
      params.set(key, SENTRY_REDACTED);
      changed = true;
    }
  }
  if (!changed) return url;

  return `${url.slice(0, queryIndex)}?${params.toString()}${url.slice(queryEnd)}`;
};
