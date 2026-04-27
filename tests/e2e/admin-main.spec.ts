import { test, expect } from "@playwright/test";
import { ADMIN_ACCESS_TOKEN, MOCK_AUTH_REFRESH } from "./helpers/admin";

const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    userId: 1,
    nickname: "관리자",
    email: "admin@example.com",
    profileImg: "",
    role: "ADMIN",
    socialUser: false,
  },
};

async function setupAdminMainMocks(page: import("@playwright/test").Page) {
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
}

test.describe("관리자 메인 페이지 (/admin)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("관리자 닉네임과 이메일이 표시된다", async ({ page }) => {
    await setupAdminMainMocks(page);
    await page.goto("/admin");

    await expect(page.getByText("관리자", { exact: true })).toBeVisible();
    await expect(page.getByText("admin@example.com")).toBeVisible();
  });

  test("프로필 수정 버튼이 표시된다", async ({ page }) => {
    await setupAdminMainMocks(page);
    await page.goto("/admin");

    await expect(page.getByRole("link", { name: "관리자 프로필 수정" })).toBeVisible();
  });

  test("관리자 메뉴 섹션이 모두 렌더링된다", async ({ page }) => {
    await setupAdminMainMocks(page);
    await page.goto("/admin");

    await expect(page.getByRole("link", { name: "공지사항" })).toBeVisible();
    await expect(page.getByRole("link", { name: "신고/문의 내역" })).toBeVisible();
    await expect(page.getByRole("link", { name: "비회원 문의 내역" })).toBeVisible();
    await expect(page.getByRole("link", { name: "유저 탈퇴 사유" })).toBeVisible();
    await expect(page.getByRole("link", { name: "콘텐츠 활용 동의 게시글" })).toBeVisible();
    await expect(page.getByRole("link", { name: "비밀번호 변경" })).toBeVisible();
  });

  test("공지사항 메뉴 클릭 시 공지사항 페이지로 이동한다", async ({ page }) => {
    await setupAdminMainMocks(page);
    await page.goto("/admin");

    await page.route("**/api/notices**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isSuccess: true,
          code: "200",
          message: "OK",
          result: { content: [], nextCursor: null, hasNext: false },
        }),
      })
    );

    await page.getByRole("link", { name: "공지사항" }).click();
    await page.waitForURL("**/admin/notice");
  });

  test("토큰 없이 접근 시 홈으로 리다이렉트된다", async ({ context, page }) => {
    await context.clearCookies();
    await setupAdminMainMocks(page);

    await page.goto("/admin");
    await page.waitForURL("/");
  });
});
