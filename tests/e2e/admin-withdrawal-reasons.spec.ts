import { test, expect, Page } from "@playwright/test";
import { MOCK_WITHDRAW_REASON_LIST } from "@/mock/data/admin.data";

const ADMIN_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.fake-signature";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

async function setupWithdrawalMocks(page: Page, items?: object[]) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("**/api/admin/users/deleted**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isSuccess: true,
        code: "200",
        message: "OK",
        result: {
          content: items ?? MOCK_WITHDRAW_REASON_LIST,
          nextCursor: null,
          hasNext: false,
        },
      }),
    })
  );
}

test.describe("관리자 유저 탈퇴 사유 페이지 (/admin/withdrawal-reasons)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("탈퇴 유저 목록이 표시된다", async ({ page }) => {
    await setupWithdrawalMocks(page);
    await page.goto("/admin/withdrawal-reasons");

    await expect(page.getByText("짱구")).toBeVisible();
    await expect(page.getByText("zzanggu@example.com")).toBeVisible();
  });

  test("탈퇴 사유가 올바르게 표시된다", async ({ page }) => {
    await setupWithdrawalMocks(page);
    await page.goto("/admin/withdrawal-reasons");

    await expect(page.getByText("잘 사용하지 않아요")).toBeVisible();
    await expect(page.getByText("다른 계정이 있어요")).toBeVisible();
  });

  test("기타 사유가 있을 때 기타 내용이 함께 표시된다", async ({ page }) => {
    await setupWithdrawalMocks(page);
    await page.goto("/admin/withdrawal-reasons");

    await expect(page.getByText("(기타) 기타")).toBeVisible();
  });

  test("탈퇴 내역이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupWithdrawalMocks(page, []);
    await page.goto("/admin/withdrawal-reasons");

    await expect(page.getByText("탈퇴한 유저가 없어요")).toBeVisible();
  });

  test("유형 필터 클릭 시 탈퇴 유형 선택 팝업이 열린다", async ({ page }) => {
    await setupWithdrawalMocks(page);
    await page.goto("/admin/withdrawal-reasons");

    await page.getByRole("button", { name: "전체 필터" }).click();

    await expect(page.getByRole("heading", { name: "탈퇴 유형 선택" })).toBeVisible();
    await expect(page.getByRole("button", { name: "적용하기" })).toBeVisible();
  });
});
