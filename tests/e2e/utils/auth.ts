import type { BrowserContext, Page } from "@playwright/test";
import { MOCK_ALERT_NOTIFICATION_EMPTY_LIST_RESPONSE } from "@/mock/data/alert.data";

/** `playwright.config.ts` 의 `use.baseURL` 과 동일한 해석 순서 */
export const resolveE2EBaseURL = (baseURL?: string) =>
  baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export const resolveE2ECookieHostname = (baseURL?: string) =>
  new URL(resolveE2EBaseURL(baseURL)).hostname;

export const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

export const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, nickName: "테스트유저", profileImage: "", email: "test@test.com" },
};

/**
 * 로그인 상태에서 모든 페이지가 호출하는 안 읽은 알림 조회를 빈 목록으로 응답합니다.
 * mock이 없으면 실제 서버가 401을 돌려 세션 만료로 로그인 페이지로 이동하므로, 로그인 상태로 도는 스펙은 이 mock을 먼저 등록합니다.
 * 알림 목록을 직접 검증하는 스펙은 이후에 등록한 route가 우선하므로 그대로 덮어쓸 수 있습니다.
 */
export const setupUnreadNotificationMocks = async (page: Page) => {
  await page.route(/\/api\/notifications(?:\?.*)?$/, (route) =>
    route.fulfill({ json: MOCK_ALERT_NOTIFICATION_EMPTY_LIST_RESPONSE })
  );
};

export const setupProtectedSessionMocks = async (page: Page) => {
  await setupUnreadNotificationMocks(page);
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("**/api/users/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_USERS_ME),
    })
  );
};

export const addRefreshCookie = async (context: BrowserContext, baseURL?: string) => {
  const domain = resolveE2ECookieHostname(baseURL);
  await context.addCookies([
    { name: "refresh_token", value: "e2e-fake-refresh", domain, path: "/" },
  ]);
};
