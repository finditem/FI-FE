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

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
