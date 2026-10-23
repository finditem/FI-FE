import type { Breadcrumb, Event } from "@sentry/nextjs";

const REDACTED = "[Redacted]";

/**
 * 이름만으로 값을 가릴 키입니다. 헤더, 폼 필드, 로컬 변수 이름에 모두 적용됩니다.
 * `code`는 넣지 않습니다. API 에러 응답의 에러 코드 필드 이름이 `code`라서 원인 추적 정보가 사라집니다.
 */
const SENSITIVE_KEY_RE = /token|password|passwd|secret|authorization|cookie|email|phone/i;

/** 키 이름이 평범해도 값 자체가 자격 증명처럼 보이면 가립니다. JWT, Bearer 토큰입니다. */
const SENSITIVE_VALUE_RE = /eyJ[\w-]{6,}\.[\w-]{6,}|\bBearer\s+[\w.-]+/;

/** URL 쿼리에서 값을 가릴 파라미터입니다. OAuth 콜백의 일회용 값과 토큰류입니다. */
const SENSITIVE_QUERY_KEYS = ["code", "state", "token", "access_token", "refresh_token"];

const MAX_DEPTH = 6;

const scrubValue = (value: unknown, seen: WeakSet<object>, depth: number): unknown => {
  if (typeof value === "string") return SENSITIVE_VALUE_RE.test(value) ? REDACTED : value;
  if (value === null || typeof value !== "object" || depth > MAX_DEPTH) return value;
  if (seen.has(value)) return REDACTED;
  seen.add(value);

  if (Array.isArray(value)) return value.map((item) => scrubValue(item, seen, depth + 1));

  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = SENSITIVE_KEY_RE.test(key) ? REDACTED : scrubValue(item, seen, depth + 1);
  }
  return result;
};

const scrubObject = <T>(value: T): T => scrubValue(value, new WeakSet(), 0) as T;

const scrubUrl = (url: string) => {
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) return url;

  const hashIndex = url.indexOf("#", queryIndex);
  const queryEnd = hashIndex === -1 ? url.length : hashIndex;
  const params = new URLSearchParams(url.slice(queryIndex + 1, queryEnd));

  let changed = false;
  for (const key of SENSITIVE_QUERY_KEYS) {
    if (params.has(key)) {
      params.set(key, REDACTED);
      changed = true;
    }
  }
  if (!changed) return url;

  return `${url.slice(0, queryIndex)}?${params.toString()}${url.slice(queryEnd)}`;
};

const scrubBreadcrumb = (breadcrumb: Breadcrumb): Breadcrumb => {
  if (!breadcrumb.data) return breadcrumb;

  const data = scrubObject(breadcrumb.data);
  for (const key of ["url", "from", "to"]) {
    if (typeof data[key] === "string") data[key] = scrubUrl(data[key]);
  }
  return { ...breadcrumb, data };
};

/**
 * Sentry 이벤트를 전송하기 직전에 개인정보와 자격 증명을 가리는 유틸 함수입니다.
 *
 * @remarks
 * - `init`의 `beforeSend`와 `beforeSendTransaction`에 그대로 넘깁니다. 서버·edge·클라이언트가 같은 함수를 씁니다.
 * - 1차 차단은 `SENTRY_DATA_COLLECTION`이 하고, 이 함수는 그 바깥으로 새는 경로를 막는 2차 방어입니다.
 *   요청 헤더·본문, `extra`, `contexts`, 스택 프레임의 로컬 변수, 브레드크럼이 대상입니다.
 * - 키 이름(`token`, `cookie`, `phone` 등)과 값의 모양(JWT, Bearer) 두 기준으로 가립니다. 이름이 평범한
 *   변수에 토큰이 들어 있어도 값으로 잡힙니다.
 * - URL은 통째로 지우지 않고 OAuth `code`·`state`와 토큰류 쿼리 값만 가립니다. 경로는 원인 추적에 필요합니다.
 * - 이벤트를 버리지 않으므로 항상 같은 이벤트 객체를 돌려줍니다.
 *
 * @param event - SDK가 만든 에러 또는 트랜잭션 이벤트
 *
 * @returns 민감 값을 `[Redacted]`로 바꾼 같은 이벤트
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * Sentry.init({
 *   dataCollection: SENTRY_DATA_COLLECTION,
 *   beforeSend: scrubSentryEvent,
 *   beforeSendTransaction: scrubSentryEvent,
 * });
 * ```
 */
export const scrubSentryEvent = <T extends Event>(event: T): T => {
  if (event.request) {
    const { cookies: _cookies, ...request } = event.request;
    event.request = {
      ...request,
      ...(request.url && { url: scrubUrl(request.url) }),
      ...(request.headers && { headers: scrubObject(request.headers) }),
      ...(request.data !== undefined && { data: scrubObject(request.data) }),
      ...(request.query_string !== undefined && {
        query_string:
          typeof request.query_string === "string"
            ? scrubUrl(`?${request.query_string}`).slice(1)
            : scrubObject(request.query_string),
      }),
    };
  }

  if (event.user) {
    const { ip_address: _ip, email: _email, ...user } = event.user;
    event.user = user;
  }

  if (event.extra) event.extra = scrubObject(event.extra);
  if (event.contexts) event.contexts = scrubObject(event.contexts);
  if (event.breadcrumbs) event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb);

  for (const exception of event.exception?.values ?? []) {
    for (const frame of exception.stacktrace?.frames ?? []) {
      if (frame.vars) frame.vars = scrubObject(frame.vars);
    }
  }

  return event;
};
