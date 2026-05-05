import { test, expect, Page } from "@playwright/test";
import {
  MOCK_NOTICE_COMMENTS_EMPTY_FIRST_PAGE,
  MOCK_NOTICES_RESPONSE,
  MOCK_USERS_ME_NOTICE_HEADER_ADMIN,
  MOCK_USERS_ME_NOTICE_HEADER_USER,
  createMockNoticeDetailHeaderResponse,
} from "@/mock/data/notice.data";

async function setupNoticeMocks(page: Page, usersMe: typeof MOCK_USERS_ME_NOTICE_HEADER_USER) {
  await page.route("**/api/users/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(usersMe),
    })
  );

  await page.route("**/api/notices**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (/^\/api\/notices\/\d+\/comments/.test(path)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_NOTICE_COMMENTS_EMPTY_FIRST_PAGE),
      });
      return;
    }

    const detailMatch = path.match(/^\/api\/notices\/(\d+)$/);
    if (detailMatch) {
      const id = Number(detailMatch[1]);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(createMockNoticeDetailHeaderResponse(id)),
      });
      return;
    }

    if (path === "/api/notices") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_NOTICES_RESPONSE),
      });
      return;
    }

    await route.continue();
  });
}

test.describe("공지사항 목록", () => {
  test("헤더·검색·목록이 보인다", async ({ page }) => {
    await setupNoticeMocks(page, MOCK_USERS_ME_NOTICE_HEADER_USER);
    await page.goto("/notice");

    await expect(page.getByRole("heading", { name: "공지사항", level: 2 })).toBeVisible();
    await expect(page.locator("h1.sr-only", { hasText: "공지사항 페이지" })).toBeAttached();

    await expect(page.getByPlaceholder("제목, 내용을 입력해 주세요.")).toBeVisible();
    await expect(page.getByRole("button", { name: "공지사항 정렬 필터" })).toBeVisible();

    await expect(page.getByText("서비스 점검 안내")).toBeVisible();
    await expect(page.getByText("이벤트: 분실물 찾기 캠페인")).toBeVisible();
  });

  test("공지 클릭 시 상세 페이지로 이동하고 제목이 보인다", async ({ page }) => {
    await setupNoticeMocks(page, MOCK_USERS_ME_NOTICE_HEADER_USER);
    await page.goto("/notice");

    await page.getByRole("link", { name: /서비스 점검 안내/ }).click();

    await page.waitForURL("**/notice/1");
    await expect(page.getByRole("heading", { name: "서비스 점검 안내" })).toBeVisible();
  });

  test("검색어 제출 시 keyword 쿼리가 반영된다", async ({ page }) => {
    await setupNoticeMocks(page, MOCK_USERS_ME_NOTICE_HEADER_USER);
    await page.goto("/notice");

    const keyword = "e2e검색";
    await page.getByPlaceholder("제목, 내용을 입력해 주세요.").fill(keyword);
    await page.getByPlaceholder("제목, 내용을 입력해 주세요.").press("Enter");

    await page.waitForURL(`**/notice?keyword=${encodeURIComponent(keyword)}`);
    await expect(page).toHaveURL(new RegExp(`[?&]keyword=${encodeURIComponent(keyword)}`));
  });

  test('정렬에서 "조회 많은 순" 선택 시 sortType이 반영된다', async ({ page }) => {
    await setupNoticeMocks(page, MOCK_USERS_ME_NOTICE_HEADER_USER);
    await page.goto("/notice");

    await page.getByRole("button", { name: "공지사항 정렬 필터" }).click();
    await page.getByRole("button", { name: "조회 많은 순" }).click();

    await page.waitForURL("**/notice?sortType=most_viewed");
    await expect(page).toHaveURL(/sortType=most_viewed/);
  });

  test("관리자일 때 공지 작성 플로팅 버튼이 보인다", async ({ page }) => {
    await setupNoticeMocks(page, MOCK_USERS_ME_NOTICE_HEADER_ADMIN);
    await page.goto("/notice");

    await expect(page.getByRole("button", { name: "공지사항 작성 페이지 이동" })).toBeVisible();
  });
});
