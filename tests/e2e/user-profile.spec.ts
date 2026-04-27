import { test, expect, Page } from "@playwright/test";
import {
  MOCK_USER_PROFILE_POST_DATA,
  MOCK_USER_PROFILE_E2E_COMMENT,
  MOCK_USER_PROFILE_FAVORITE_DATA,
} from "@/mock/data/userProfile.data";

const USER_ID = 2;
const MY_USER_ID = 1;

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: MY_USER_ID, temporaryPassword: false },
};

const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: MY_USER_ID, nickName: "나", profileImage: "", email: "test@test.com" },
};

const makeProfileResponse = (
  overrides: {
    posts?: object[];
    comments?: object[];
    favorites?: object[];
  } = {}
) => ({
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    userId: USER_ID,
    nickname: "짱구",
    profileImg: "",
    posts: overrides.posts ?? [MOCK_USER_PROFILE_POST_DATA],
    comments: overrides.comments ?? [],
    favorites: overrides.favorites ?? [],
    nextCursor: null,
    hasNext: false,
  },
});

type SetupOptions = {
  isLoggedIn?: boolean;
  isOwnProfile?: boolean;
  postsResponse?: object;
  commentsResponse?: object;
  favoritesResponse?: object;
};

async function setupUserProfileMocks(page: Page, options: SetupOptions = {}) {
  const {
    isLoggedIn = false,
    isOwnProfile = false,
    postsResponse = makeProfileResponse(),
    commentsResponse = makeProfileResponse({
      posts: [],
      comments: [MOCK_USER_PROFILE_E2E_COMMENT],
    }),
    favoritesResponse = makeProfileResponse({
      posts: [],
      favorites: [MOCK_USER_PROFILE_FAVORITE_DATA],
    }),
  } = options;

  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  const meResult = isOwnProfile
    ? { ...MOCK_USERS_ME.result, userId: USER_ID }
    : MOCK_USERS_ME.result;

  await page.route("**/api/users/me", (route) => {
    if (!isLoggedIn) {
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          isSuccess: false,
          code: "401",
          message: "Unauthorized",
          result: null,
        }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...MOCK_USERS_ME, result: meResult }),
    });
  });

  await page.route(`**/api/users/${USER_ID}/page**`, (route) => {
    const url = new URL(route.request().url());
    const type = url.searchParams.get("type");

    if (type === "COMMENTS") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(commentsResponse),
      });
    }
    if (type === "FAVORITES") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(favoritesResponse),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(postsResponse),
    });
  });
}

test.describe("타인 프로필 페이지 (/user/[userId])", () => {
  test("프로필 정보와 탭이 정상 렌더링된다", async ({ page }) => {
    await setupUserProfileMocks(page);
    await page.goto(`/user/${USER_ID}`);

    await expect(page.getByRole("heading", { name: "짱구 프로필" })).toBeVisible();
    await expect(page.locator("button", { hasText: "게시글" })).toBeVisible();
    await expect(page.locator("button", { hasText: "댓글" })).toBeVisible();
    await expect(page.locator("button", { hasText: "즐겨찾기" })).toBeVisible();
  });

  test("기본 게시글 탭에서 게시글 목록이 표시된다", async ({ page }) => {
    await setupUserProfileMocks(page);
    await page.goto(`/user/${USER_ID}`);

    await expect(page.getByText("아이폰 15 분실")).toBeVisible();
  });

  test("게시글이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupUserProfileMocks(page, {
      postsResponse: makeProfileResponse({ posts: [] }),
    });
    await page.goto(`/user/${USER_ID}`);

    await expect(page.getByText("아직 작성한 게시글이 없어요")).toBeVisible();
  });

  test("댓글 탭 클릭 시 댓글 목록이 표시된다", async ({ page }) => {
    await setupUserProfileMocks(page);
    await page.goto(`/user/${USER_ID}`);

    await page.locator("button", { hasText: "댓글" }).click();

    await expect(page.getByText("혹시 제 물건인가요?")).toBeVisible();
  });

  test("댓글이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupUserProfileMocks(page, {
      commentsResponse: makeProfileResponse({ posts: [], comments: [] }),
    });
    await page.goto(`/user/${USER_ID}`);

    await page.locator("button", { hasText: "댓글" }).click();

    await expect(page.getByText("아직 작성한 댓글이 없어요")).toBeVisible();
  });

  test("즐겨찾기 탭 클릭 시 즐겨찾기 목록이 표시된다", async ({ page }) => {
    await setupUserProfileMocks(page);
    await page.goto(`/user/${USER_ID}`);

    await page.locator("button", { hasText: "즐겨찾기" }).click();

    await expect(page.getByText("갤럭시 폰 습득")).toBeVisible();
  });

  test("즐겨찾기가 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupUserProfileMocks(page, {
      favoritesResponse: makeProfileResponse({ posts: [], favorites: [] }),
    });
    await page.goto(`/user/${USER_ID}`);

    await page.locator("button", { hasText: "즐겨찾기" }).click();

    await expect(page.getByText("아직 즐겨찾기한 게시글이 없어요")).toBeVisible();
  });

  test("로그인 상태에서 타인 프로필의 더보기 메뉴를 열면 신고하기가 표시된다", async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupUserProfileMocks(page, { isLoggedIn: true });

    await page.goto(`/user/${USER_ID}`);

    await page.getByRole("button", { name: "더보기 메뉴" }).click();

    await expect(page.getByRole("button", { name: "신고하기" })).toBeVisible();
  });

  test("신고하기 클릭 시 신고 모달이 열린다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupUserProfileMocks(page, { isLoggedIn: true });

    await page.goto(`/user/${USER_ID}`);

    await page.getByRole("button", { name: "더보기 메뉴" }).click();
    await page.getByRole("button", { name: "신고하기" }).click();

    await expect(page.getByRole("button", { name: "차단 및 신고하기" })).toBeVisible();
  });

  test("본인 프로필에서는 더보기 메뉴가 표시되지 않는다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupUserProfileMocks(page, { isLoggedIn: true, isOwnProfile: true });

    await page.goto(`/user/${USER_ID}`);

    await expect(page.getByRole("button", { name: "더보기 메뉴" })).not.toBeVisible();
  });
});
