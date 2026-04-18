import { test, expect, Page } from "@playwright/test";

const POST_ID = 42;

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const makeMockPostDetail = (overrides: Record<string, unknown> = {}) => ({
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    id: POST_ID,
    title: "원본 분실물 제목",
    content: "원본 내용입니다.",
    address: "서울특별시 중구 명동길 14",
    latitude: 37.5636,
    longitude: 126.9849,
    postType: "LOST",
    postStatus: "SEARCHING",
    radius: 3000,
    category: "ELECTRONICS",
    favoriteCount: 0,
    favoriteStatus: false,
    viewCount: 10,
    isNew: false,
    isHot: false,
    createdAt: "2024-01-15T12:00:00Z",
    isMine: true,
    imageResponseList: [],
    postUserInformation: {
      userId: 1,
      nickName: "나",
      profileImage: "",
      postCount: 5,
      chattingCount: 0,
    },
    ...overrides,
  },
});

const MOCK_PUT_RESPONSE = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { id: POST_ID },
};

const MOCK_VWORLD_RESPONSE = {
  response: {
    status: "OK",
    result: {
      items: [
        {
          address: {
            road: "서울특별시 강남구 테헤란로 152",
            parcel: "서울특별시 강남구 역삼동 1",
          },
          point: { x: "127.0365", y: "37.5001" },
        },
      ],
    },
  },
};

const MOCK_KAKAO_COORD2ADDRESS = {
  documents: [
    {
      address: {
        address_name: "서울특별시 강남구 역삼동 1",
        region_2depth_name: "강남구",
        region_3depth_name: "역삼동",
      },
      road_address: {
        address_name: "서울특별시 강남구 테헤란로 152",
        region_3depth_name: "역삼동",
      },
    },
  ],
  meta: { total_count: 1 },
};

async function setupEditPageMocks(page: Page, postDetailOverrides: Record<string, unknown> = {}) {
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
        body: JSON.stringify(makeMockPostDetail(postDetailOverrides)),
      });
    }
    return route.continue();
  });

  await page.route("**/api/vworld**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_VWORLD_RESPONSE),
    })
  );

  await page.route("https://dapi.kakao.com/v2/local/geo/coord2address.json**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_KAKAO_COORD2ADDRESS),
    })
  );

  await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());
}

async function changeLocation(page: Page) {
  await page.locator('a[href="/write/post/location"]').click();
  await page.waitForURL("**/write/post/location");

  await page.getByPlaceholder("지역명을 입력해 주세요.").fill("테헤란로");
  await expect(page.getByRole("button", { name: /서울특별시 강남구 테헤란로/ })).toBeVisible({
    timeout: 5000,
  });
  await page.getByRole("button", { name: /서울특별시 강남구 테헤란로/ }).click();

  await page.waitForURL("**/write/post/location?**");
  const applyButton = page.getByRole("button", { name: "적용하기" });
  await expect(applyButton).not.toBeDisabled();
  await applyButton.click();
}

test.describe("게시글 수정 페이지", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: "refresh_token",
        value: "fake-refresh-token-for-e2e",
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("기존 게시글 데이터로 폼이 초기화된다", async ({ page }) => {
    await setupEditPageMocks(page);

    await page.goto(`/write/post/${POST_ID}`);

    await expect(page.getByRole("heading", { name: "분실했어요 수정", level: 2 })).toBeVisible();

    await expect(page.getByText("전자기기", { exact: true })).toBeVisible();

    await expect(page.locator("#title")).toHaveValue("원본 분실물 제목");

    await expect(page.locator("#content")).toHaveValue("원본 내용입니다.");

    await expect(page.getByText("서울특별시 중구 명동길 14")).toBeVisible();
  });

  test("제목과 내용을 수정하고 저장할 수 있다", async ({ page }) => {
    await setupEditPageMocks(page);

    await page.route(`**/api/posts/${POST_ID}`, async (route) => {
      if (route.request().method() === "PUT") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_PUT_RESPONSE),
        });
      }
      return route.fallback();
    });

    await page.goto(`/write/post/${POST_ID}`);

    await expect(page.locator("#title")).toHaveValue("원본 분실물 제목");

    await page.locator("#title").fill("수정된 분실물 제목");

    await page.locator("#content").fill("수정된 내용입니다.");

    const submitButton = page.getByRole("button", { name: "작성 완료" });
    await expect(submitButton).not.toBeDisabled();
    await submitButton.click();

    await page.waitForURL(`**/list/${POST_ID}`);
  });

  test("카테고리를 변경하고 저장할 수 있다", async ({ page }) => {
    await setupEditPageMocks(page);

    await page.route(`**/api/posts/${POST_ID}`, async (route) => {
      if (route.request().method() === "PUT") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_PUT_RESPONSE),
        });
      }
      return route.fallback();
    });

    await page.goto(`/write/post/${POST_ID}`);
    await expect(page.locator("#title")).toHaveValue("원본 분실물 제목");

    await page.getByRole("button", { name: "카테고리 선택" }).click();
    await expect(page.getByText("카테고리 선택")).toBeVisible();
    await page.getByText("가방").click();
    await page.getByRole("button", { name: "적용하기" }).click();

    await expect(page.getByText("가방", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "작성 완료" }).click();
    await page.waitForURL(`**/list/${POST_ID}`);
  });

  test("위치를 변경하고 저장할 수 있다", async ({ page }) => {
    await setupEditPageMocks(page);

    await page.route(`**/api/posts/${POST_ID}`, async (route) => {
      if (route.request().method() === "PUT") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_PUT_RESPONSE),
        });
      }
      return route.fallback();
    });

    await page.goto(`/write/post/${POST_ID}`);
    await expect(page.locator("#title")).toHaveValue("원본 분실물 제목");

    await changeLocation(page);

    await page.waitForURL(`**/write/post/${POST_ID}`);
    await expect(page.getByText("서울특별시 강남구 테헤란로 152")).toBeVisible();

    await page.getByRole("button", { name: "작성 완료" }).click();
    await page.waitForURL(`**/list/${POST_ID}`);
  });

  test("PUT 요청에 수정된 값이 담겨 전송된다", async ({ page }) => {
    await setupEditPageMocks(page);

    let capturedBody: string | null = null;
    await page.route(`**/api/posts/${POST_ID}`, async (route) => {
      if (route.request().method() === "PUT") {
        capturedBody = route.request().postData();
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_PUT_RESPONSE),
        });
      }
      return route.fallback();
    });

    await page.goto(`/write/post/${POST_ID}`);
    await expect(page.locator("#title")).toHaveValue("원본 분실물 제목");

    await page.locator("#title").fill("PUT 요청 검증 제목");

    await page.getByRole("button", { name: "작성 완료" }).click();
    await page.waitForURL(`**/list/${POST_ID}`);

    expect(capturedBody).not.toBeNull();

    const jsonStringMatch = capturedBody!.match(/\{[\s\S]*"title"[\s\S]*\}/);
    expect(jsonStringMatch).not.toBeNull();

    const requestData = JSON.parse(jsonStringMatch![0]);
    expect(requestData.title).toBe("PUT 요청 검증 제목");
  });

  test("발견 게시글 수정 페이지는 올바른 타이틀을 표시한다", async ({ page }) => {
    await setupEditPageMocks(page, { postType: "FOUND" });

    await page.goto(`/write/post/${POST_ID}`);

    await expect(page.getByRole("heading", { name: "발견했어요 수정", level: 2 })).toBeVisible();
  });

  test("타인 게시글 수정 페이지 접근 시 404를 반환한다", async ({ page }) => {
    await setupEditPageMocks(page, { isMine: false });

    await page.goto(`/write/post/${POST_ID}`);

    await expect(page.getByText("페이지를 찾을 수 없습니다.")).toBeVisible();
  });

  test("존재하지 않는 게시글 수정 페이지 접근 시 404를 반환한다", async ({ page }) => {
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
    await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());

    await page.goto(`/write/post/${POST_ID}`);

    await expect(page.getByText("페이지를 찾을 수 없습니다.")).toBeVisible();
  });

  test("인증되지 않은 사용자는 로그인 페이지로 리다이렉트된다", async ({ context, page }) => {
    await context.clearCookies();

    await page.goto(`/write/post/${POST_ID}`);
    await page.waitForURL("**/login**");
    await expect(page).toHaveURL(/\/login/);
  });
});
