import { test, expect, Page } from "@playwright/test";
import {
  MOCK_AUTH_REFRESH,
  MOCK_KAKAO_COORD2ADDRESS,
  MOCK_MARKER,
  MOCK_RECENT_FOUND_EMPTY,
  MOCK_USERS_ME,
} from "@/mock/data/main.data";

async function setupMainPageMocks(page: Page) {
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

  await page.route("https://dapi.kakao.com/v2/local/geo/coord2address.json**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_KAKAO_COORD2ADDRESS),
    })
  );

  await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());

  await page.route("**/api/main/posts/marker**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_MARKER),
    })
  );

  await page.route("**/api/main/posts/recent-found**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_RECENT_FOUND_EMPTY),
    })
  );
}

test.describe("메인 페이지", () => {
  test("헤더·바텀시트 기본 UI가 보인다", async ({ page }) => {
    await setupMainPageMocks(page);
    await page.goto("/");

    await expect(page.getByPlaceholder("현재 위치 (위치 정보 허용 시)")).toBeVisible();

    await expect(page.getByRole("link", { name: "분실 신고 목록 페이지로 이동" })).toBeVisible();
    await expect(page.getByRole("link", { name: "발견 신고 목록 페이지로 이동" })).toBeVisible();

    await expect(page.getByText("아직 발견된 분실물이 없어요")).toBeVisible({ timeout: 15000 });

    await expect(page.getByRole("button", { name: "바텀시트 높이 조절" })).toBeVisible();
  });

  test("분실 신고 카드 클릭 시 분실 목록으로 이동한다", async ({ page }) => {
    await setupMainPageMocks(page);
    await page.goto("/");

    await page.getByRole("link", { name: "분실 신고 목록 페이지로 이동" }).click();

    await page.waitForURL("**/list?type=lost");
    await expect(page).toHaveURL(/\/list\?type=lost/);
  });

  test("발견 신고 카드 클릭 시 발견 목록으로 이동한다", async ({ page }) => {
    await setupMainPageMocks(page);
    await page.goto("/");

    await page.getByRole("link", { name: "발견 신고 목록 페이지로 이동" }).click();

    await page.waitForURL("**/list?type=found");
    await expect(page).toHaveURL(/\/list\?type=found/);
  });

  test("검색어 제출 시 메인에 검색 쿼리가 반영된다", async ({ page }) => {
    await setupMainPageMocks(page);
    await page.goto("/");

    const keyword = "테스트키워드";
    const searchInput = page.getByPlaceholder("현재 위치 (위치 정보 허용 시)");
    await searchInput.fill(keyword);
    await searchInput.press("Enter");

    await page.waitForURL(`**/?search=${encodeURIComponent(keyword)}`);
    await expect(page).toHaveURL(new RegExp(`[?&]search=${encodeURIComponent(keyword)}`));
  });
});
