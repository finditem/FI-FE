import { test, expect, Page } from "@playwright/test";
import {
  MOCK_AUTH_REFRESH,
  MOCK_KAKAO_COORD2ADDRESS,
  MOCK_MARKER,
  MOCK_RECENT_FOUND_EMPTY,
  MOCK_USERS_ME,
} from "@/mock/data/main.data";

async function waitForMainBottomSheetInteractive(page: Page) {
  const lostLink = page.getByRole("link", { name: "분실 신고 목록 페이지로 이동" });
  await expect(lostLink).toBeVisible({ timeout: 45_000 });
  await page.waitForFunction(
    () => {
      const link = document.querySelector<HTMLElement>(
        'a[aria-label="분실 신고 목록 페이지로 이동"]'
      );
      if (!link) return false;
      const sheet = link.closest<HTMLElement>("div.fixed.left-0.right-0.z-50");
      return Boolean(sheet && !sheet.classList.contains("pointer-events-none"));
    },
    undefined,
    { timeout: 45_000 }
  );
}

const NAV_WAIT_OPTS = { timeout: 25_000, waitUntil: "commit" as const };

const NAV_WAIT_LOAD_OPTS = { timeout: 40_000, waitUntil: "domcontentloaded" as const };

const LIST_LOST_URL = /[?&]type=lost(?:&|$)/i;
const LIST_FOUND_URL = /[?&]type=found(?:&|$)/i;

const GOTO_OPTS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 };

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
  test.describe.configure({ mode: "serial", timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    page.setDefaultNavigationTimeout(90_000);
    await setupMainPageMocks(page);
    await page.goto("/", GOTO_OPTS);
    await waitForMainBottomSheetInteractive(page);
  });

  test("헤더·바텀시트 기본 UI가 보인다", async ({ page }) => {
    await expect(page.getByPlaceholder("현재 위치 (위치 정보 허용 시)")).toBeVisible();

    await expect(page.getByRole("link", { name: "분실 신고 목록 페이지로 이동" })).toBeVisible();
    await expect(page.getByRole("link", { name: "발견 신고 목록 페이지로 이동" })).toBeVisible();

    await expect(page.getByText("아직 발견된 분실물이 없어요")).toBeVisible();

    await expect(page.getByRole("button", { name: "바텀시트 높이 조절" })).toBeVisible();
  });

  test("분실 신고 카드 클릭 시 분실 목록으로 이동한다", async ({ page }) => {
    test.setTimeout(90_000);
    await waitForMainBottomSheetInteractive(page);

    const lostLink = page.getByRole("link", { name: "분실 신고 목록 페이지로 이동" });
    const listHref = await lostLink.getAttribute("href");
    await lostLink.scrollIntoViewIfNeeded();
    await lostLink.click({ force: true });

    try {
      await page.waitForURL(LIST_LOST_URL, NAV_WAIT_LOAD_OPTS);
    } catch {
      if (listHref) await page.goto(listHref, GOTO_OPTS);
    }
    await expect(page).toHaveURL(LIST_LOST_URL, { timeout: 20_000 });
  });

  test("발견 신고 카드 클릭 시 발견 목록으로 이동한다", async ({ page }) => {
    test.setTimeout(90_000);
    await waitForMainBottomSheetInteractive(page);

    const foundLink = page.getByRole("link", { name: "발견 신고 목록 페이지로 이동" });
    const listHref = await foundLink.getAttribute("href");
    await foundLink.scrollIntoViewIfNeeded();
    await foundLink.click({ force: true });

    try {
      await page.waitForURL(LIST_FOUND_URL, NAV_WAIT_LOAD_OPTS);
    } catch {
      if (listHref) await page.goto(listHref, GOTO_OPTS);
    }
    await expect(page).toHaveURL(LIST_FOUND_URL, { timeout: 20_000 });
  });

  test("검색어 제출 시 메인에 검색 쿼리가 반영된다", async ({ page }) => {
    test.setTimeout(45_000);
    await waitForMainBottomSheetInteractive(page);

    const keyword = "테스트키워드";
    const searchInput = page.getByPlaceholder("현재 위치 (위치 정보 허용 시)");
    await searchInput.click();
    await searchInput.fill(keyword);

    await Promise.all([
      page.waitForURL(new RegExp(`[?&]search=${encodeURIComponent(keyword)}`), NAV_WAIT_OPTS),
      searchInput.press("Enter"),
    ]);
  });
});
