import { test, expect, Page, BrowserContext } from "@playwright/test";
import {
  MOCK_CHAT_LIST_EMPTY_RESPONSE,
  MOCK_CHAT_LIST_FIRST_PAGE_RESPONSE,
  MOCK_CHAT_ITEM,
} from "@/mock/data/chat.data";

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

const setupChatListMocks = async (
  page: Page,
  payload: typeof MOCK_CHAT_LIST_FIRST_PAGE_RESPONSE
) => {
  await setupProtectedSessionMocks(page);

  await page.route("**/api/users/me/chats**", (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
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

test.describe("채팅 목록 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.routeWebSocket(/\/api\/ws/, (ws) => {
      ws.close();
    });
  });

  test("헤더·채팅 목록 한 줄이 렌더링된다", async ({ context, page }) => {
    await addRefreshCookie(context);
    await setupChatListMocks(page, MOCK_CHAT_LIST_FIRST_PAGE_RESPONSE);
    await page.goto("/chat");

    await expect(page.getByRole("heading", { level: 2, name: "채팅" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "채팅 목록 페이지", includeHidden: true })
    ).toBeAttached();

    await expect(page.getByText(MOCK_CHAT_ITEM.contactUser.nickname)).toBeVisible();
    await expect(page.getByText(MOCK_CHAT_ITEM.postInfo.address)).toBeVisible();
    await expect(
      page.getByRole("link", { name: `${MOCK_CHAT_ITEM.postInfo.postId} 채팅방 링크` })
    ).toBeVisible();
  });

  test("지역 선택 필터 클릭 시 지역 검색 모드로 전환된다", async ({ context, page }) => {
    await addRefreshCookie(context);
    await setupChatListMocks(page, MOCK_CHAT_LIST_FIRST_PAGE_RESPONSE);
    await page.goto("/chat");

    await page.getByRole("button", { name: "채팅 리스트 지역 선택 필터" }).click();

    await expect(page).toHaveURL(/search=region/);
    await expect(page.getByRole("heading", { level: 2, name: "지역 선택" })).toBeVisible();
    await expect(page.getByPlaceholder("시/군/구를 입력해 주세요.")).toBeVisible();
  });

  test("채팅이 없을 때 빈 상태 문구가 표시된다", async ({ context, page }) => {
    await addRefreshCookie(context);
    await setupChatListMocks(page, MOCK_CHAT_LIST_EMPTY_RESPONSE);
    await page.goto("/chat");

    await expect(page.getByText("아직 채팅 내역이 없어요")).toBeVisible();
  });
});
