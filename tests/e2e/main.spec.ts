import { test, expect, Page } from "@playwright/test";
import {
  MOCK_AUTH_REFRESH,
  MOCK_MARKER,
  MOCK_RECENT_FOUND_EMPTY,
  MOCK_USERS_ME,
} from "@/mock/data/main.data";

const LOST_WRITE_LABEL = "분실했어요 글쓰기 페이지로 이동";
const FOUND_WRITE_LABEL = "발견했어요 글쓰기 안내 열기";

async function waitForMainBottomSheetInteractive(page: Page) {
  const lostLink = page.getByRole("link", { name: LOST_WRITE_LABEL });
  await expect(lostLink).toBeVisible({ timeout: 45_000 });
  await page.waitForFunction(
    (label) => {
      const link = document.querySelector<HTMLElement>(`a[aria-label="${label}"]`);
      if (!link) return false;
      const sheet = link.closest<HTMLElement>("div.fixed.left-0.right-0.z-50");
      return Boolean(sheet && !sheet.classList.contains("pointer-events-none"));
    },
    LOST_WRITE_LABEL,
    { timeout: 45_000 }
  );
}

// 미들웨어는 refresh_token 쿠키로 로그인 여부를 판단한다.
// 쿠키 없이 미리 불러온 글쓰기 경로의 리다이렉트가 남지 않도록 쿠키를 넣은 뒤 홈을 다시 연다.
async function reopenMainAsLoggedIn(page: Page) {
  await page
    .context()
    .addCookies([{ name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" }]);
  await page.goto("/", GOTO_OPTS);
  await waitForMainBottomSheetInteractive(page);
}

const isLoginUrlWithCallback = (url: URL, callbackUrl: string) =>
  /\/login$/.test(url.pathname) && url.searchParams.get("callbackUrl") === callbackUrl;

const NAV_WAIT_OPTS = { timeout: 25_000, waitUntil: "commit" as const };

const NAV_WAIT_LOAD_OPTS = { timeout: 40_000, waitUntil: "domcontentloaded" as const };

const WRITE_LOST_URL = /\/write\/post\?type=lost(?:&|$)/;
const WRITE_FIND_URL = /\/write\/post\?type=find(?:&|$)/;

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

  await page.route("https://oapi.map.naver.com/**", (route) => route.abort());

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
    await expect(page.getByPlaceholder("이 동네 어디서 잃어버리셨나요?")).toBeVisible();

    await expect(page.getByRole("link", { name: LOST_WRITE_LABEL })).toBeVisible();
    await expect(page.getByRole("button", { name: FOUND_WRITE_LABEL })).toBeVisible();

    await expect(page.getByText("아직 발견된 분실물이 없어요")).toBeVisible();

    await expect(page.getByRole("button", { name: "바텀시트 높이 조절" })).toBeVisible();
  });

  test("로그인 상태에서 분실 카드를 누르면 분실 글쓰기로 이동한다", async ({ page }) => {
    test.setTimeout(90_000);
    await reopenMainAsLoggedIn(page);

    const lostLink = page.getByRole("link", { name: LOST_WRITE_LABEL });
    await lostLink.scrollIntoViewIfNeeded();
    await lostLink.click();

    await page.waitForURL(WRITE_LOST_URL, NAV_WAIT_LOAD_OPTS);
  });

  test("비로그인 상태에서 분실 카드를 누르면 로그인 화면으로 이동한다", async ({ page }) => {
    test.setTimeout(90_000);

    const lostLink = page.getByRole("link", { name: LOST_WRITE_LABEL });
    await lostLink.scrollIntoViewIfNeeded();
    await lostLink.click();

    await page.waitForURL(
      (url) => isLoginUrlWithCallback(url, "/write/post?type=lost"),
      NAV_WAIT_LOAD_OPTS
    );
  });

  test("발견 카드를 누르면 경찰청 우선 신고 안내 모달이 열리고 취소로 닫힌다", async ({ page }) => {
    const foundButton = page.getByRole("button", { name: FOUND_WRITE_LABEL });
    await foundButton.scrollIntoViewIfNeeded();
    await foundButton.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("게시글 작성 전 확인해 주세요!")).toBeVisible();

    await dialog.getByRole("button", { name: "취소" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });

  test("로그인 상태에서 안내 모달의 글쓰기를 누르면 발견 글쓰기로 이동한다", async ({ page }) => {
    test.setTimeout(90_000);
    await reopenMainAsLoggedIn(page);

    const foundButton = page.getByRole("button", { name: FOUND_WRITE_LABEL });
    await foundButton.scrollIntoViewIfNeeded();
    await foundButton.click();
    await page.getByRole("dialog").getByRole("link", { name: "글쓰기" }).click();

    await page.waitForURL(WRITE_FIND_URL, NAV_WAIT_LOAD_OPTS);
  });

  test("비로그인 상태에서 안내 모달의 글쓰기를 누르면 로그인 화면으로 이동한다", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    const foundButton = page.getByRole("button", { name: FOUND_WRITE_LABEL });
    await foundButton.scrollIntoViewIfNeeded();
    await foundButton.click();
    await page.getByRole("dialog").getByRole("link", { name: "글쓰기" }).click();

    await page.waitForURL(
      (url) => isLoginUrlWithCallback(url, "/write/post?type=find"),
      NAV_WAIT_LOAD_OPTS
    );
  });

  test("검색어 제출 시 메인에 검색 쿼리가 반영된다", async ({ page }) => {
    test.setTimeout(45_000);
    await waitForMainBottomSheetInteractive(page);

    const keyword = "테스트키워드";
    const searchInput = page.getByPlaceholder("이 동네 어디서 잃어버리셨나요?");
    await searchInput.click();
    await searchInput.fill(keyword);

    await Promise.all([
      page.waitForURL(new RegExp(`[?&]search=${encodeURIComponent(keyword)}`), NAV_WAIT_OPTS),
      searchInput.press("Enter"),
    ]);
  });
});
