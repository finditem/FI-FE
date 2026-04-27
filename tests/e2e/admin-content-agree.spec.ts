import { test, expect, Page } from "@playwright/test";
import { MOCK_POST_ITEM } from "@/mock/data/posts.data";

const ADMIN_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.fake-signature";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

async function setupContentAgreeMocks(page: Page, items?: object[]) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("**/api/admin/marketing-consent/posts**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isSuccess: true,
        code: "200",
        message: "OK",
        result: {
          postList: items ?? [MOCK_POST_ITEM],
          nextCursor: null,
          hasNext: false,
        },
      }),
    })
  );
}

test.describe("관리자 콘텐츠 활용 동의 페이지 (/admin/content-agree)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("게시글 목록이 표시된다", async ({ page }) => {
    await setupContentAgreeMocks(page);
    await page.goto("/admin/content-agree");

    await expect(page.getByText("아이폰 15 분실")).toBeVisible();
  });

  test("게시글이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupContentAgreeMocks(page, []);
    await page.goto("/admin/content-agree");

    await expect(page.getByText("아직 게시글이 없어요.")).toBeVisible();
  });

  test("검색 버튼 클릭 시 검색 페이지로 이동한다", async ({ page }) => {
    await setupContentAgreeMocks(page);
    await page.goto("/admin/content-agree");

    await page.route("**/api/admin/marketing-consent/posts**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isSuccess: true,
          code: "200",
          message: "OK",
          result: { postList: [], nextCursor: null, hasNext: false },
        }),
      })
    );

    await page.getByRole("button", { name: "검색" }).click();
    await page.waitForURL("**/admin/content-agree/search");
  });
});

test.describe("관리자 콘텐츠 활용 동의 검색 페이지 (/admin/content-agree/search)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("검색 페이지가 렌더링된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/marketing-consent/posts**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isSuccess: true,
          code: "200",
          message: "OK",
          result: { postList: [MOCK_POST_ITEM], nextCursor: null, hasNext: false },
        }),
      })
    );

    await page.goto("/admin/content-agree/search?search=아이폰");

    await expect(page.getByRole("heading", { name: "콘텐츠 활용 동의 게시글" })).toBeVisible();
    await expect(page.getByText("아이폰 15 분실")).toBeVisible();
  });
});
