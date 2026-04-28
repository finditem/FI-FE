import { test, expect, Page } from "@playwright/test";
import { MOCK_ADMIN_REPORT_LIST, MOCK_ADMIN_INQUIRY_LIST } from "@/mock/data/admin.data";
import { ADMIN_ACCESS_TOKEN, MOCK_AUTH_REFRESH } from "./helpers/admin";

const makeListResponse = <T>(content: T[]) => ({
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { content, nextCursor: null, hasNext: false },
});

const MOCK_REPORT_DETAIL = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    reportId: 1,
    targetType: "POST",
    targetId: 101,
    targetTitle: "테스트 게시글",
    reportType: "SPAM",
    reason: "광고성 링크가 반복적으로 포함된 게시글입니다.",
    status: "PENDING",
    answered: false,
    adminAnswer: "",
    adminId: 0,
    adminNickname: "",
    adminProfileImg: "",
    answerImageList: [],
    answeredAt: "",
    reporterNickname: "짱구",
    reporterEmail: "jjanggu@example.com",
    createdAt: "2025-02-01T10:15:00",
    resolvedAt: "",
  },
};

const MOCK_INQUIRY_DETAIL = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    inquiryId: 1,
    title: "로그인이 되지 않습니다.",
    content: "로그인 시 계속 오류가 발생합니다.",
    inquiryType: "GENERAL",
    status: "RECEIVED",
    createdAt: "2025-02-01T10:15:00",
    nickname: "짱구",
    ip: "192.168.0.1",
    imageUrls: [],
    answered: false,
    comments: [],
  },
};

async function setupReportsMocks(
  page: Page,
  overrides: {
    reports?: object[];
    inquiries?: object[];
  } = {}
) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("**/api/admin/reports**", (route) => {
    if (route.request().method() !== "GET") return route.continue();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(makeListResponse(overrides.reports ?? MOCK_ADMIN_REPORT_LIST)),
    });
  });

  await page.route("**/api/admin/inquiries**", (route) => {
    if (route.request().method() !== "GET") return route.continue();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(makeListResponse(overrides.inquiries ?? MOCK_ADMIN_INQUIRY_LIST)),
    });
  });
}

test.describe("관리자 신고/문의 내역 페이지 (/admin/reports)", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("신고 탭이 기본으로 활성화되고 신고 목록이 표시된다", async ({ page }) => {
    await setupReportsMocks(page);
    await page.goto("/admin/reports");

    await expect(page.getByText("분실물과 무관한 홍보성 게시글이에요.")).toBeVisible();
    await expect(page.getByText("광고성 링크가 반복적으로 포함된 게시글입니다.")).toBeVisible();
    await expect(page.getByText("짱구")).toBeVisible();
  });

  test("문의 탭 클릭 시 문의 목록이 표시된다", async ({ page }) => {
    await setupReportsMocks(page);
    await page.goto("/admin/reports");

    await page.locator("button", { hasText: "문의" }).click();

    await expect(page.getByText("로그인이 되지 않습니다.")).toBeVisible();
    await expect(page.getByText("로그인 시 계속 오류가 발생합니다.")).toBeVisible();
  });

  test("신고 목록이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupReportsMocks(page, { reports: [] });
    await page.goto("/admin/reports");

    await expect(page.getByText("신고 내역이 없어요")).toBeVisible();
  });

  test("문의 목록이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupReportsMocks(page, { inquiries: [] });
    await page.goto("/admin/reports");

    await page.locator("button", { hasText: "문의" }).click();

    await expect(page.getByText("문의 내역이 없어요")).toBeVisible();
  });

  test("신고 항목 클릭 시 신고 상세 페이지로 이동한다", async ({ page }) => {
    await setupReportsMocks(page);
    await page.goto("/admin/reports");

    await page.route("**/api/admin/reports/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPORT_DETAIL),
      })
    );

    await page.getByText("분실물과 무관한 홍보성 게시글이에요.").click();
    await page.waitForURL("**/admin/reports/report/1");
  });

  test("문의 항목 클릭 시 문의 상세 페이지로 이동한다", async ({ page }) => {
    await setupReportsMocks(page);
    await page.goto("/admin/reports");

    await page.locator("button", { hasText: "문의" }).click();

    await page.route("**/api/admin/inquiries/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_INQUIRY_DETAIL),
      })
    );

    await page.getByText("로그인이 되지 않습니다.").click();
    await page.waitForURL("**/admin/reports/inquiry/1");
  });
});

test.describe("관리자 신고 상세 페이지 (/admin/reports/report/[id])", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("신고 상세 내용이 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/reports/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPORT_DETAIL),
      })
    );

    await page.goto("/admin/reports/report/1");

    await expect(page.getByText("분실물과 무관한 홍보성 게시글이에요.")).toBeVisible();
    await expect(page.getByText("광고성 링크가 반복적으로 포함된 게시글입니다.")).toBeVisible();
    await expect(page.getByText("짱구")).toBeVisible();
  });

  test("신고 상태 변경 버튼이 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/reports/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_REPORT_DETAIL),
      })
    );

    await page.goto("/admin/reports/report/1");

    await expect(page.getByRole("button", { name: "상태 변경" })).toBeVisible();
  });
});

test.describe("관리자 문의 상세 페이지 (/admin/reports/inquiry/[id])", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
  });

  test("문의 상세 내용이 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/inquiries/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_INQUIRY_DETAIL),
      })
    );

    await page.goto("/admin/reports/inquiry/1");

    await expect(page.getByText("로그인이 되지 않습니다.")).toBeVisible();
    await expect(page.getByText("로그인 시 계속 오류가 발생합니다.")).toBeVisible();
    await expect(page.getByText("짱구")).toBeVisible();
  });

  test("문의 상태 변경 버튼이 표시된다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route("**/api/admin/inquiries/1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_INQUIRY_DETAIL),
      })
    );

    await page.goto("/admin/reports/inquiry/1");

    await expect(page.getByRole("button", { name: "상태 변경" })).toBeVisible();
  });
});
