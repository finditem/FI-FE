import { test, expect, Page } from "@playwright/test";

const POST_ID = 1;

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const makeMockPostDetail = (
  overrides: Partial<{ isMine: boolean; favoriteStatus: boolean }> = {}
) => ({
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    id: POST_ID,
    title: "테스트 분실물 제목",
    content: "명동 근처에서 전자기기를 잃어버렸습니다.",
    address: "서울특별시 중구 명동길 14",
    latitude: 37.5636,
    longitude: 126.9849,
    postType: "LOST",
    postStatus: "SEARCHING",
    radius: 3000,
    category: "ELECTRONICS",
    favoriteCount: 5,
    favoriteStatus: false,
    viewCount: 100,
    isNew: false,
    isHot: true,
    createdAt: "2024-01-15T12:00:00Z",
    isMine: false,
    imageResponseList: [],
    postUserInformation: {
      userId: 2,
      nickName: "테스트유저",
      profileImage: "",
      postCount: 3,
      chattingCount: 1,
    },
    ...overrides,
  },
});

const MOCK_POST_META = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    title: "테스트 분실물 제목",
    summary: "명동 근처에서 전자기기를 잃어버렸습니다.",
    thumbnailUrl: "",
    address: "서울특별시 중구 명동길 14",
    likeCount: 5,
    commentCount: 2,
    viewCount: 100,
  },
};

const MOCK_SIMILAR_EMPTY = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: [],
};

const MOCK_COMMENTS = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    comments: [
      {
        id: 10,
        deleted: false,
        depth: 0,
        content: "혹시 제 물건 아닌가요?",
        createdAt: "2024-01-15T13:00:00Z",
        authorResponse: { userId: 3, nickName: "댓글유저", profileImage: "" },
        childCommentCount: 0,
        imageList: [],
        likeCount: 0,
        isLike: false,
        canEdit: false,
        canDelete: false,
      },
    ],
    hasNext: false,
    nextPage: 0,
    totalCommentCount: 1,
    remainingCount: 0,
  },
};

const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, nickName: "나", profileImage: "", email: "test@test.com" },
};

type SetupOptions = {
  isMine?: boolean;
  favoriteStatus?: boolean;
  isLoggedIn?: boolean;
};

async function setupDetailPageMocks(page: Page, options: SetupOptions = {}) {
  const { isMine = false, favoriteStatus = false, isLoggedIn = false } = options;

  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route(`**/api/posts/${POST_ID}`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(makeMockPostDetail({ isMine, favoriteStatus })),
      });
    }
    return route.continue();
  });

  await page.route(`**/api/posts/${POST_ID}/share`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_POST_META),
    })
  );

  await page.route(`**/api/posts/${POST_ID}/similar`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_SIMILAR_EMPTY),
    })
  );

  if (isLoggedIn) {
    await page.route(`**/api/comments/posts/${POST_ID}**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_COMMENTS),
      })
    );
  }

  await page.route("**/api/users/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_USERS_ME),
    })
  );

  await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());
}

test.describe("게시글 상세 페이지", () => {
  test("비로그인 상태에서 게시글 정보가 정상 렌더링된다", async ({ page }) => {
    await setupDetailPageMocks(page, { isLoggedIn: false });

    await page.goto(`/list/${POST_ID}`);

    await expect(page.getByRole("heading", { name: "테스트 분실물 제목", level: 1 })).toBeVisible();

    await expect(page.getByText("명동 근처에서 전자기기를 잃어버렸습니다.")).toBeVisible();

    await expect(page.getByText("찾아요", { exact: true })).toBeVisible();
    await expect(page.getByText("전자기기", { exact: true })).toBeVisible();

    await expect(page.getByText("테스트유저")).toBeVisible();

    await expect(page.getByTestId("post-chat-button")).toBeVisible();
  });

  test("비로그인 상태에서 댓글 입력 시 게스트 로그인 모달이 뜬다", async ({ page }) => {
    await setupDetailPageMocks(page, { isLoggedIn: false });

    await page.goto(`/list/${POST_ID}`);

    await page.getByPlaceholder("메시지 보내기").click();

    await expect(page.getByRole("heading", { name: "로그인하고 댓글을 확인하세요" })).toBeVisible({
      timeout: 3000,
    });
  });

  test("로그인 상태에서 댓글 목록이 표시된다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupDetailPageMocks(page, { isLoggedIn: true });

    await page.goto(`/list/${POST_ID}`);

    await expect(page.getByText("혹시 제 물건 아닌가요?")).toBeVisible();
  });

  test("로그인 상태에서 즐겨찾기를 추가할 수 있다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupDetailPageMocks(page, { isLoggedIn: true, favoriteStatus: false });

    let favoriteCalled = false;
    await page.route(`**/api/posts/${POST_ID}/favorites`, (route) => {
      if (route.request().method() === "POST") {
        favoriteCalled = true;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ isSuccess: true, code: "200", message: "OK", result: null }),
        });
      }
      return route.continue();
    });

    await page.goto(`/list/${POST_ID}`);

    await page.getByTestId("post-detail-favorite-button").click();
    await expect(favoriteCalled).toBe(true);
  });

  test("로그인 상태에서 즐겨찾기를 제거할 수 있다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupDetailPageMocks(page, { isLoggedIn: true, favoriteStatus: true });

    let deleteCalledMethod = "";
    await page.route(`**/api/posts/${POST_ID}/favorites`, (route) => {
      deleteCalledMethod = route.request().method();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ isSuccess: true, code: "200", message: "OK", result: null }),
      });
    });

    await page.goto(`/list/${POST_ID}`);
    await page.getByTestId("post-detail-favorite-button").click();
    await expect(deleteCalledMethod).toBe("DELETE");
  });

  test("본인 게시글에서 메뉴를 열면 수정·삭제·상태변경 항목이 표시된다", async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupDetailPageMocks(page, { isMine: true, isLoggedIn: true });

    await page.goto(`/list/${POST_ID}`);

    await page.getByTestId("post-detail-menu-button").click();

    await expect(page.getByTestId("post-menu-edit-button")).toBeVisible();
    await expect(page.getByTestId("post-menu-delete-button")).toBeVisible();
    await expect(page.getByTestId("post-menu-status-button")).toBeVisible();
  });

  test("타인 게시글에서 메뉴를 열면 신고·차단 항목이 표시된다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupDetailPageMocks(page, { isMine: false, isLoggedIn: true });

    await page.goto(`/list/${POST_ID}`);

    await page.getByTestId("post-detail-menu-button").click();

    await expect(page.getByTestId("post-report-button")).toBeVisible();
    await expect(page.getByTestId("post-block-button")).toBeVisible();
  });

  test("본인 게시글 삭제 플로우가 정상 동작한다", async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
    ]);
    await setupDetailPageMocks(page, { isMine: true, isLoggedIn: true });

    await page.route(`**/api/posts/${POST_ID}`, async (route) => {
      if (route.request().method() === "DELETE") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ isSuccess: true, code: "200", message: "OK", result: null }),
        });
      }

      return route.fallback();
    });

    await page.goto(`/list/${POST_ID}`);

    await page.getByTestId("post-detail-menu-button").click();
    await expect(page.getByTestId("post-action-menu-container")).toBeVisible();
    await page.getByTestId("post-menu-delete-button").click();

    await expect(page.getByTestId("post-delete-modal-title")).toBeVisible();
    await page.getByTestId("post-delete-confirm-button").click();
  });

  test("존재하지 않는 게시글 접근 시 스켈레톤 에러 상태를 보여준다", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_AUTH_REFRESH),
      })
    );
    await page.route(`**/api/posts/${POST_ID}`, (route) =>
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ isSuccess: false, code: "404", message: "Not Found", result: null }),
      })
    );
    await page.route(`**/api/posts/${POST_ID}/share`, (route) =>
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ result: null }),
      })
    );
    await page.route(`**/api/posts/${POST_ID}/similar`, (route) =>
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ result: null }),
      })
    );
    await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());

    await page.goto(`/list/${POST_ID}`);

    await expect(page.getByText("게시글 불러오기에 실패했어요")).toBeVisible({ timeout: 5000 });
  });
});
