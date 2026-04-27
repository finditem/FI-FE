import { test, expect, Page } from "@playwright/test";
import { MOCK_ADMIN_GUEST_INQUIRY_LIST } from "@/mock/data/admin.data";

const ADMIN_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.fake-signature";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const MOCK_GUEST_INQUIRY_DETAIL = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    inquiryId: 1,
    title: "광고성 링크가 반복적으로 포함된 게시글입니다.",
    content: "여기에 문의 내용이 표기됩니다.",
    inquiryType: "TECHNICAL",
    status: "PENDING",
    createdAt: "2025-02-01T10:15:00",
    email: "[EMAIL_ADDRESS]",
    answered: true,
    imageUrls: [],
    comments: [],
  },
};

async function setupGuestInquiriesMocks(page: Page, items?: object[]) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("**/api/admin/guest-inquiries**", (route) => {
    if (route.request().method() !== "GET") return route.continue();

    const url = new URL(route.request().url());
    if (url.pathname.match(/\/admin\/guest-inquiries\/\d+/)) return route.continue();

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        isSuccess: true,
        code: "200",
        message: "OK",
        result: {
          items: items ?? [MOCK_ADMIN_GUEST_INQUIRY_LIST],
          nextCursor: null,
          hasNext: false,
        },
      }),
    });
  });
}

test.describe("관리자 비회원 문의 목록 페이지 (/admin/guest-inquiries)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("비회원 문의 목록이 표시된다", async ({ page }) => {
    await setupGuestInquiriesMocks(page);
    await page.goto("/admin/guest-inquiries");

    await expect(page.getByText("광고성 링크가 반복적으로 포함된 게시글입니다.")).toBeVisible();
    await expect(page.getByText("[EMAIL_ADDRESS]")).toBeVisible();
  });

  test("비회원 문의가 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupGuestInquiriesMocks(page, []);
    await page.goto("/admin/guest-inquiries");

    await expect(page.getByText("등록된 문의 내역이 없어요")).toBeVisible();
  });

  test("비회원 문의 항목 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
    await setupGuestInquiriesMocks(page);
    await page.goto("/admin/guest-inquiries");

    await page.route("**/api/admin/guest-inquiries/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GUEST_INQUIRY_DETAIL),
      })
    );

    await page.getByText("광고성 링크가 반복적으로 포함된 게시글입니다.").click();
    await page.waitForURL("**/admin/guest-inquiries/1");
  });
});

test.describe("관리자 비회원 문의 상세 페이지 (/admin/guest-inquiries/[id])", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("비회원 문의 상세 내용이 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/guest-inquiries/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GUEST_INQUIRY_DETAIL),
      })
    );

    await page.goto("/admin/guest-inquiries/1");

    await expect(page.getByText("광고성 링크가 반복적으로 포함된 게시글입니다.")).toBeVisible();
    await expect(page.getByText("여기에 문의 내용이 표기됩니다.")).toBeVisible();
    await expect(page.getByText("[EMAIL_ADDRESS]")).toBeVisible();
  });

  test("이메일 복사하기 버튼이 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/guest-inquiries/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GUEST_INQUIRY_DETAIL),
      })
    );

    await page.goto("/admin/guest-inquiries/1");

    await expect(page.getByRole("button", { name: "이메일 복사하기" })).toBeVisible();
  });
});
