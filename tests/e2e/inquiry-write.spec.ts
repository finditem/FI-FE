import { test, expect, Page } from "@playwright/test";
import {
  MOCK_POST_INQUIRY_SUCCESS,
  MOCK_INQUIRIES_ME_EMPTY,
  createMockGetUserInquiryByIdResponse,
  E2E_INQUIRY_ID,
} from "@/mock/data/inquiry.data";
import { MOCK_USERS_ME_NOTICE_HEADER_USER } from "@/mock/data/notice.data";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const INQUIRY_E2E_TITLE = "E2E 1:1 문의 제목";
const INQUIRY_E2E_CONTENT = "E2E 문의 본문입니다. 최소 길이를 만족합니다.";

const setupInquiryWriteMocks = async (page: Page) => {
  await page.context().addCookies([
    {
      name: "refresh_token",
      value: "e2e-placeholder",
      url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    },
  ]);
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

  await page.route("**/api/inquiries**", async (route) => {
    const url = new URL(route.request().url());
    const { pathname } = url;
    const method = route.request().method();

    if (pathname === "/api/inquiries/me" && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_INQUIRIES_ME_EMPTY),
      });
      return;
    }

    if (pathname === "/api/inquiries" && method === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_POST_INQUIRY_SUCCESS),
      });
      return;
    }

    const detailMatch = pathname.match(/^\/api\/inquiries\/(\d+)$/);
    if (detailMatch && method === "GET") {
      const id = Number(detailMatch[1]);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          createMockGetUserInquiryByIdResponse(id, INQUIRY_E2E_TITLE, INQUIRY_E2E_CONTENT)
        ),
      });
      return;
    }

    await route.continue();
  });
};

test.describe("1:1 문의 작성 (/inquiry-write)", () => {
  test.describe.configure({ mode: "serial" });

  test("폼이 보이고 필수 입력 후 등록하면 문의 상세로 이동한다", async ({ page }) => {
    await setupInquiryWriteMocks(page);
    await page.goto("/inquiry-write");

    await expect(
      page.getByRole("heading", { name: "무엇을 도와드릴까요?", level: 2 })
    ).toBeVisible();

    await expect(page.getByPlaceholder("문의 제목을 입력해 주세요.")).toBeVisible();

    const emailInput = page.getByPlaceholder("이메일을 입력해주세요.");
    await expect(emailInput).toBeDisabled();
    await expect(emailInput).toHaveValue(MOCK_USERS_ME_NOTICE_HEADER_USER.result.email);

    await page.getByPlaceholder("문의 제목을 입력해 주세요.").fill(INQUIRY_E2E_TITLE);

    await page.getByRole("button", { name: /카테고리를 선택해주세요/ }).click();
    await expect(page.getByRole("heading", { name: "카테고리 선택" })).toBeVisible();
    await page.getByText("이용방법", { exact: true }).click();
    await page.getByRole("button", { name: "적용하기" }).click();

    await page
      .getByPlaceholder(/이용하며 느끼신 불편한 점이나 바라는 점을 알려주세요/)
      .fill(INQUIRY_E2E_CONTENT);

    await page.getByRole("button", { name: "문의 등록" }).click();

    await expect(page).toHaveURL(new RegExp(`/mypage/inquiries/${E2E_INQUIRY_ID}`));
    await expect(page.getByText(INQUIRY_E2E_TITLE)).toBeVisible();
  });
});
