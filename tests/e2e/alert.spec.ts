import { test, expect, Page, BrowserContext } from "@playwright/test";
import {
  MOCK_ALERT_NOTIFICATION_EMPTY_LIST_RESPONSE,
  MOCK_ALERT_NOTIFICATION_LIST_RESPONSE,
} from "@/mock/data/alert.data";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, nickName: "테스트유저", profileImage: "", email: "test@test.com" },
};

const setupProtectedSessionMocks = async (page: Page) => {
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

const setupAlertNotificationMocks = async (
  page: Page,
  payload: typeof MOCK_ALERT_NOTIFICATION_LIST_RESPONSE
) => {
  await setupProtectedSessionMocks(page);

  await page.route("**/api/notifications**", (route) => {
    if (route.request().method() !== "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isSuccess: true,
          code: "200",
          message: "OK",
          result: null,
        }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });
};

const addRefreshCookie = async (context: BrowserContext) => {
  await context.addCookies([
    { name: "refresh_token", value: "e2e-fake-refresh", domain: "localhost", path: "/" },
  ]);
};

test.describe.configure({ mode: "serial" });

test.describe("알림 페이지", () => {
  test("헤더·카테고리 필터·알림 목록이 렌더링된다", async ({ context, page }) => {
    await addRefreshCookie(context);
    await setupAlertNotificationMocks(page, MOCK_ALERT_NOTIFICATION_LIST_RESPONSE);
    await page.goto("/alert");

    await expect(page.getByRole("heading", { level: 2, name: "알림" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "알림 페이지", includeHidden: true })
    ).toBeAttached();

    await expect(page.getByRole("button", { name: "전체 필터" })).toBeVisible();
    await expect(page.getByText("채팅 알림")).toBeVisible();
    await expect(page.getByText("새 메시지가 도착했습니다.")).toBeVisible();
  });

  test("채팅 카테고리 선택 시 URL에 category=chat 이 반영된다", async ({ context, page }) => {
    await addRefreshCookie(context);
    await setupAlertNotificationMocks(page, MOCK_ALERT_NOTIFICATION_LIST_RESPONSE);
    await page.goto("/alert");

    await page.getByRole("button", { name: "채팅 필터" }).click();

    await expect(page).toHaveURL(/\/alert\?category=chat$/);
  });

  test("알림이 없을 때 빈 상태 문구가 표시된다", async ({ context, page }) => {
    await addRefreshCookie(context);
    await setupAlertNotificationMocks(page, MOCK_ALERT_NOTIFICATION_EMPTY_LIST_RESPONSE);
    await page.goto("/alert");

    await expect(page.getByText("아직 새 소식이 없어요")).toBeVisible();
  });
});
