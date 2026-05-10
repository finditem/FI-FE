import type { BrowserContext, Page } from "@playwright/test";

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

export const setupProtectedSessionMocks = async (page: Page) => {
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
