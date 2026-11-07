import type { BrowserOptions } from "@sentry/nextjs";

type DataCollection = NonNullable<BrowserOptions["dataCollection"]>;

/**
 * Sentry가 이벤트에 자동으로 싣는 개인정보의 범위입니다. 서버·edge·클라이언트 init이 함께 씁니다.
 *
 * @remarks
 * - 예전 `sendDefaultPii: true`는 모든 항목을 수집하는 것과 같았습니다. 쿠키에는 `access_token`과
 *   `refresh_token`이 들어 있으므로 쿠키·사용자 정보·요청 본문 수집을 끕니다.
 * - 헤더와 URL 쿼리는 원인 추적에 필요해 기본값(수집)을 유지합니다. SDK가 토큰처럼 보이는 키는
 *   가리고, OAuth 콜백의 일회용 값(`code`, `state`)은 여기서 명시적으로 뺍니다.
 * - Sentry 11부터 적지 않은 항목은 수집하는 쪽이 기본값입니다. 헤더는 v10이 기본으로 빼던 IP·프록시 계열을
 *   계속 빼고, 이 앱이 쓰지 않는 DB·큐·GraphQL·생성형 AI 데이터 수집은 명시적으로 끕니다.
 * - 전송 직전의 2차 마스킹은 에러 이벤트를 `scrubSentryEvent`가, 스팬을 `scrubSentrySpan`이 맡습니다.
 *
 * @author jikwon
 */
export const SENTRY_DATA_COLLECTION = {
  userInfo: false,
  cookies: false,
  httpHeaders: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
  httpBodies: [],
  urlQueryParams: { deny: ["code", "state"] },
  databaseQueryData: false,
  queues: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false },
} satisfies DataCollection;
