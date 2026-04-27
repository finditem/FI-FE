import { test, expect, Page } from "@playwright/test";
import { MOCK_NOTICE_LIST } from "@/mock/data/admin.data";

const ADMIN_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.fake-signature";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

async function setupNoticeMocks(page: Page, items?: object[]) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("**/api/notices**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isSuccess: true,
        code: "200",
        message: "OK",
        result: {
          content: items ?? [MOCK_NOTICE_LIST],
          nextCursor: null,
          hasNext: false,
        },
      }),
    })
  );
}

test.describe("관리자 공지사항 목록 페이지 (/admin/notice)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("공지사항 목록이 표시된다", async ({ page }) => {
    await setupNoticeMocks(page);
    await page.goto("/admin/notice");

    await expect(page.getByText("[공지] 공지사항 제목")).toBeVisible();
  });

  test("공지사항이 없을 때 빈 상태로 목록이 비어있다", async ({ page }) => {
    await setupNoticeMocks(page, []);
    await page.goto("/admin/notice");

    await expect(page.getByText("[공지] 공지사항 제목")).not.toBeVisible();
  });

  test("정렬 필터 버튼 클릭 시 드롭다운이 열린다", async ({ page }) => {
    await setupNoticeMocks(page);
    await page.goto("/admin/notice");

    await page.getByText("최신순").click();

    await expect(page.getByRole("button", { name: "오래된순" })).toBeVisible();
    await expect(page.getByRole("button", { name: "조회순" })).toBeVisible();
  });
});

test.describe("관리자 공지사항 글쓰기 페이지 (/admin/notice/write)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("글쓰기 폼 요소가 모두 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );

    await page.goto("/admin/notice/write");

    await expect(page.getByPlaceholder("제목을 입력해 주세요.")).toBeVisible();
    await expect(page.getByPlaceholder("내용을 입력해 주세요.")).toBeVisible();
  });

  test("필수 필드 미입력 시 등록 버튼이 비활성화된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );

    await page.goto("/admin/notice/write");

    await expect(page.getByRole("button", { name: "작성 완료" })).toBeDisabled();
  });

  test("모든 필수 필드 입력 시 등록 버튼이 활성화된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );

    await page.goto("/admin/notice/write");

    await page.getByPlaceholder("제목을 입력해 주세요.").fill("테스트 공지사항");
    await page.getByPlaceholder("내용을 입력해 주세요.").fill("테스트 공지사항 내용입니다.");
    await page.getByRole("button", { name: "카테고리 선택" }).click();
    await expect(page.getByRole("heading", { name: "카테고리 선택" })).toBeVisible();
    await page.locator("label", { hasText: "일반" }).click();
    await page.getByRole("button", { name: "적용하기" }).click();

    await expect(page.getByRole("button", { name: "작성 완료" })).toBeEnabled();
  });
});
