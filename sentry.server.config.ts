// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";
const isE2E = process.env.NEXT_PUBLIC_IS_E2E === "true";

Sentry.init({
  dsn: "https://733ec55f58e2fda3ed51d8127bda3036@o4510692801249280.ingest.us.sentry.io/4510692807475200",

  // Conditionally disable locally and during E2E tests
  enabled: isProd && !isE2E,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // 미설정 시 SDK는 모든 아웃바운드 요청에 sentry-trace/baggage 헤더를 붙인다.
  // 공공데이터포털 게이트웨이는 헤더 값에 environment= 토큰이 있으면 400을 반환하므로,
  // 자체 도메인으로 나가는 요청에만 트레이스를 전파한다.
  tracePropagationTargets: [/^\//, /^https:\/\/(www\.|api\.|dev-api\.)?finditem\.kr/],

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
