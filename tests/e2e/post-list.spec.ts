import { test, expect, Page } from "@playwright/test";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const MOCK_POSTS_SEARCH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    hasNext: false,
    nextCursor: null,
    postList: [
      {
        id: 1,
        title: "테스트 분실물 제목",
        summary: "테스트 요약 내용입니다.",
        thumbnailImageUrl: "",
        address: "서울특별시 중구 명동길 14",
        postStatus: "SEARCHING",
        postType: "LOST",
        category: "ELECTRONICS",
        favoriteCount: 5,
        favoriteStatus: false,
        viewCount: 100,
        isNew: true,
        isHot: false,
        createdAt: "2024-01-15T12:00:00Z",
        imageCount: 1,
      },
      {
        id: 2,
        title: "두번째 테스트 게시글",
        summary: "이것도 잃어버렸어요.",
        thumbnailImageUrl: "",
        address: "서울특별시 강남구 테헤란로",
        postStatus: "SEARCHING",
        postType: "LOST",
        category: "BAG",
        favoriteCount: 1,
        favoriteStatus: true,
        viewCount: 10,
        isNew: false,
        isHot: true,
        createdAt: "2024-01-14T12:00:00Z",
        imageCount: 0,
      },
    ],
  },
};

const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, nickName: "테스트유저", profileImage: "", email: "test@test.com" },
};

async function setupListPageMocks(page: Page) {
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

  await page.route("**/api/posts/search**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_POSTS_SEARCH),
    })
  );

  await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());
}

test.describe("게시글 목록 페이지", () => {
  test("게시글 목록이 정상적으로 렌더링된다", async ({ page }) => {
    await setupListPageMocks(page);

    await page.goto("/list");

    await expect(page.getByText("테스트 분실물 제목")).toBeVisible();
    await expect(page.getByText("두번째 테스트 게시글")).toBeVisible();

    await expect(page.getByText("서울특별시 중구 명동길 14")).toBeVisible();
    await expect(page.getByText("서울특별시 강남구 테헤란로")).toBeVisible();
  });

  test("게시글 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/list");

    await page.getByText("테스트 분실물 제목").click();

    await page.waitForURL("**/list/1");
  });

  test("비로그인 상태에서도 목록을 자유롭게 볼 수 있다", async ({ context, page }) => {
    await context.clearCookies();
    await setupListPageMocks(page);

    await page.goto("/list");

    await expect(page.getByText("두번째 테스트 게시글")).toBeVisible();
  });
});
