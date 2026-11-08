// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { SENTRY_DATA_COLLECTION } from "@/constants/SENTRY_DATA_COLLECTION";
import { SENTRY_IGNORE_ERRORS } from "@/constants/SENTRY_IGNORE_ERRORS";
import { scrubSentryEvent } from "@/utils/scrubSentryEvent/scrubSentryEvent";
import { scrubSentrySpan } from "@/utils/scrubSentrySpan/scrubSentrySpan";

const isProd = process.env.NODE_ENV === "production";
const isE2E = process.env.NEXT_PUBLIC_IS_E2E === "true";

Sentry.init({
  dsn: "https://733ec55f58e2fda3ed51d8127bda3036@o4510692801249280.ingest.us.sentry.io/4510692807475200",

  // Conditionally disable locally and during E2E tests
  enabled: isProd && !isE2E,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // 쿠키·사용자 정보·요청 본문은 수집하지 않고, 전송 직전에 토큰과 연락처를 한 번 더 가린다.
  dataCollection: SENTRY_DATA_COLLECTION,
  beforeSend: scrubSentryEvent,
  // 코드 결함이 아닌 정상 흐름·외부 요인 에러는 보내지 않는다. 기준은 상수 파일 주석에 있다.
  ignoreErrors: SENTRY_IGNORE_ERRORS,
  beforeSendSpan: scrubSentrySpan,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
