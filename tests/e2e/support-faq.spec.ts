import { test, expect, Page } from "@playwright/test";
import { MOCK_USERS_ME_NOTICE_HEADER_USER } from "@/mock/data/notice.data";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const setupSupportPageMocks = async (page: Page) => {
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
      body: JSON.stringify(MOCK_USERS_ME_NOTICE_HEADER_USER),
    })
  );
};

test.describe("자주 묻는 질문 (/support)", () => {
  test("헤더·탭·FAQ 목록이 보인다", async ({ page }) => {
    await setupSupportPageMocks(page);
    await page.goto("/support");

    await expect(page.getByRole("heading", { name: "자주 묻는 질문", level: 2 })).toBeVisible();
    await expect(page.locator("h1.sr-only", { hasText: "자주 묻는 질문" })).toBeAttached();

    await expect(page.getByRole("button", { name: "전체" })).toBeVisible();
    await expect(page.getByRole("button", { name: "계정" })).toBeVisible();

    await expect(page.getByText("찾아줘 서비스는 어떤 플랫폼인가요?")).toBeVisible();
    await expect(page.getByText("분실물은 어떻게 찾을 수 있나요?")).toBeVisible();
  });

  test("FAQ를 펼치면 답변 내용이 보인다", async ({ page }) => {
    await setupSupportPageMocks(page);
    await page.goto("/support");

    await page.getByRole("link", { name: "FAQ 질문 접기/펼치기" }).first().click();

    await expect(page.getByText(/찾아줘는 분실물과 습득물을 빠르게 연결해 주는/)).toBeVisible();
  });

  test("답변에 링크 버튼이 있으면 노출된다", async ({ page }) => {
    await setupSupportPageMocks(page);
    await page.goto("/support");

    await page.getByRole("link", { name: "FAQ 질문 접기/펼치기" }).nth(1).click();

    await expect(page.getByRole("link", { name: "게시글 목록 바로가기" })).toBeVisible();
  });

  test("계정 탭 선택 시 해당 카테고리 FAQ만 보인다", async ({ page }) => {
    await setupSupportPageMocks(page);
    await page.goto("/support");

    await page.getByRole("button", { name: "계정" }).click();

    await page.waitForURL("**/support?tab=account");
    await expect(page.getByText("회원가입은 어떻게 하나요?")).toBeVisible();
    await expect(page.getByText("찾아줘 서비스는 어떤 플랫폼인가요?")).not.toBeVisible();
  });

  test("1:1 문의하기 버튼으로 문의 작성 페이지로 이동한다", async ({ page }) => {
    await setupSupportPageMocks(page);
    await page.goto("/support");

    await page.getByRole("link", { name: /1:1 문의하기/ }).click();

    await page.waitForURL("**/inquiry-write");
    await expect(page).toHaveURL(/\/inquiry-write$/);
  });
});
