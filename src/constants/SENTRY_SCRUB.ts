/** Sentry로 보내기 전에 민감 값을 바꿔 넣는 문구입니다. 이벤트와 스팬 마스킹이 함께 씁니다. */
export const SENTRY_REDACTED = "[Redacted]";

/**
 * 이름만으로 값을 가릴 키입니다. 헤더, 폼 필드, 로컬 변수, 스팬 속성 이름에 모두 적용됩니다.
 * `code`는 넣지 않습니다. API 에러 응답의 에러 코드 필드 이름이 `code`라서 원인 추적 정보가 사라집니다.
 */
export const SENTRY_SENSITIVE_KEY_RE =
  /token|password|passwd|secret|authorization|cookie|email|phone/i;
