import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");

    // e2e에서 SSR 프리패치가 호출하는 외부 API를 서버 측 MSW로 가로채 결정적으로 응답한다.
    // 운영에서는 NEXT_PUBLIC_IS_E2E가 없어 import 자체가 실행되지 않는다.
    if (process.env.NEXT_PUBLIC_IS_E2E === "true") {
      const { server } = await import("./mock/server");
      server.listen({ onUnhandledRequest: "bypass" });
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
