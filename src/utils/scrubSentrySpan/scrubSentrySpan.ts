import type { BrowserOptions } from "@sentry/nextjs";
import { SENTRY_REDACTED, SENTRY_SENSITIVE_KEY_RE } from "@/constants/SENTRY_SCRUB";
import { isSensitiveSentryValue } from "@/utils/isSensitiveSentryValue/isSensitiveSentryValue";
import { scrubSentryUrl } from "@/utils/scrubSentryUrl/scrubSentryUrl";

/** `@sentry/nextjs`가 스팬 타입을 내보내지 않으므로 `beforeSendSpan` 옵션의 인자 타입에서 꺼냅니다. */
type StreamedSpan = Parameters<NonNullable<BrowserOptions["beforeSendSpan"]>>[0];

const scrubString = (value: string) =>
  isSensitiveSentryValue(value) ? SENTRY_REDACTED : scrubSentryUrl(value);

/**
 * 속성 값은 원시값, 원시값 배열, 또는 `{ value, unit }` 형태의 객체로 들어옵니다.
 * 객체 형태는 `value`만 같은 규칙으로 가리고 나머지 필드는 유지합니다.
 */
const scrubAttributeValue = (value: unknown): unknown => {
  if (typeof value === "string") return scrubString(value);
  if (Array.isArray(value)) return value.map(scrubAttributeValue);
  if (value !== null && typeof value === "object" && "value" in value) {
    return { ...value, value: scrubAttributeValue(value.value) };
  }
  return value;
};

/**
 * Sentry 스팬을 전송하기 직전에 개인정보와 자격 증명을 가리는 유틸 함수입니다.
 *
 * @remarks
 * - `init`의 `beforeSendSpan`에 그대로 넘깁니다. 서버·edge·클라이언트가 같은 함수를 씁니다.
 * - Sentry 11부터 트랜잭션 이벤트가 사라지고 스팬이 하나씩 전송되므로 `beforeSendTransaction`은 호출되지 않습니다.
 *   예전 트랜잭션 마스킹을 이 함수가 대신합니다. 예전 트랜잭션에 해당하는 루트 스팬은 `is_segment`가 `true`입니다.
 * - 이름은 URL 쿼리의 OAuth `code`·`state`와 토큰류 값만 가립니다.
 * - 속성은 키 이름(`authorization`, `cookie` 등)이 민감하면 통째로 가리고, 아니면 값의 모양(JWT, Bearer)과 URL 쿼리를 검사합니다.
 * - 스팬을 버릴 수 없는 훅이므로 항상 같은 스팬 객체를 돌려줍니다. 스팬을 걸러야 하면 `ignoreSpans`를 씁니다.
 *
 * @param span - SDK가 만든 스트리밍 스팬
 *
 * @returns 민감 값을 `[Redacted]`로 바꾼 같은 스팬
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * Sentry.init({
 *   dataCollection: SENTRY_DATA_COLLECTION,
 *   beforeSend: scrubSentryEvent,
 *   beforeSendSpan: scrubSentrySpan,
 * });
 * ```
 */
export const scrubSentrySpan = (span: StreamedSpan): StreamedSpan => {
  span.name = scrubSentryUrl(span.name);

  const attributes: Record<string, unknown> = span.attributes;
  for (const [key, value] of Object.entries(attributes)) {
    attributes[key] = SENTRY_SENSITIVE_KEY_RE.test(key)
      ? SENTRY_REDACTED
      : scrubAttributeValue(value);
  }

  return span;
};
