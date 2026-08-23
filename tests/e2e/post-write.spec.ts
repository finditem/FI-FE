import { test, expect, Page } from "@playwright/test";

const MOCK_VWORLD_RESPONSE = {
  response: {
    status: "OK",
    result: {
      items: [
        {
          address: {
            road: "서울특별시 중구 명동길 14",
            parcel: "서울특별시 중구 명동2가 1",
          },
          point: { x: "126.9849", y: "37.5636" },
        },
      ],
    },
  },
};

const MOCK_KAKAO_COORD2ADDRESS = {
  documents: [
    {
      address: {
        address_name: "서울특별시 중구 명동2가 1",
        region_2depth_name: "중구",
        region_3depth_name: "명동2가",
      },
      road_address: {
        address_name: "서울특별시 중구 명동길 14",
        region_3depth_name: "명동",
      },
    },
  ],
  meta: { total_count: 1 },
};

const MOCK_POST_RESPONSE = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { id: 999 },
};

const MOCK_AUTH_REFRESH_RESPONSE = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

async function setupCommonMocks(page: Page) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH_RESPONSE),
    })
  );

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

  await page.route("**/api/posts", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_POST_RESPONSE),
      });
    } else {
      await route.continue();
    }
  });
}

async function fillLocation(page: Page) {
  await page.locator('a[href="/write/post/location"]').click();
  await page.waitForURL("**/write/post/location");

  await page.getByPlaceholder("지역명을 입력해 주세요.").fill("명동");
  await expect(page.getByRole("button", { name: /서울특별시 중구 명동길/ })).toBeVisible({
    timeout: 5000,
  });
  await page.getByRole("button", { name: /서울특별시 중구 명동길/ }).click();

  await page.waitForURL("**/write/post/location?**");
  const applyButton = page.getByRole("button", { name: "적용하기" });
  await expect(applyButton).not.toBeDisabled();
  await applyButton.click();
}

function todayYmd() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

async function selectToday(page: Page) {
  await page.locator("#date-value").click();
  await page.getByRole("button", { name: "오늘" }).click();
  // 값이 없을 때도 오늘 날짜를 안내로 보여주므로 텍스트만으로는 선택 여부를 가릴 수 없다.
  // 값이 들어오면 span이 time으로 바뀌는 것으로 확인한다.
  await expect(page.locator("time#date-value")).toHaveText(todayYmd());
}

test.describe("게시글 생성 페이지", () => {
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

  test("분실한 물건을 이미지 없이 등록할 수 있다", async ({ page }) => {
    await setupCommonMocks(page);

    await page.goto("/write/post?type=lost");
    await expect(page.getByRole("heading", { name: "분실했어요 글쓰기", level: 2 })).toBeVisible();

    await page.getByRole("button", { name: "카테고리 선택" }).click();
    await expect(page.getByText("카테고리 선택")).toBeVisible();
    await page.getByText("전자기기").click();
    await page.getByRole("button", { name: "적용하기" }).click();
    await expect(page.getByText("전자기기", { exact: true })).toBeVisible();

    await page.locator("#title").fill("테스트 분실물 제목");

    await page.locator("#content").fill("테스트 내용입니다. 분실물에 대한 상세 내용입니다.");

    await selectToday(page);

    await fillLocation(page);

    await page.waitForURL("**/write/post?type=lost");
    await expect(page.getByText("서울특별시 중구 명동길 14")).toBeVisible();

    const submitButton = page.getByRole("button", { name: "작성 완료" });
    await expect(submitButton).not.toBeDisabled();
    await submitButton.click();
    await expect(page.getByText("사진을 첨부하지 않고 등록하시겠습니까?")).toBeVisible();
    await page.getByRole("button", { name: "이미지 없이 등록" }).click();

    await page.waitForURL("**/list/999");
  });

  test("발견한 물건을 등록할 수 있다", async ({ page }) => {
    await setupCommonMocks(page);

    await page.goto("/write/post?type=find");
    await expect(page.getByRole("heading", { name: "발견했어요 글쓰기", level: 2 })).toBeVisible();

    await page.getByRole("button", { name: "카테고리 선택" }).click();
    await page.getByText("가방").click();
    await page.getByRole("button", { name: "적용하기" }).click();

    await page.locator("#title").fill("테스트 발견물 제목");
    await page.locator("#content").fill("테스트 내용입니다.");

    await selectToday(page);

    await fillLocation(page);

    await page.waitForURL("**/write/post?type=find");
    await page.getByRole("button", { name: "작성 완료" }).click();
    await page.getByRole("button", { name: "이미지 없이 등록" }).click();
    await page.waitForURL("**/list/999");
  });

  test("날짜를 고르기 전에는 작성 완료 버튼이 비활성화된다", async ({ page }) => {
    await setupCommonMocks(page);

    await page.goto("/write/post?type=lost");

    await page.getByRole("button", { name: "카테고리 선택" }).click();
    await page.getByText("전자기기").click();
    await page.getByRole("button", { name: "적용하기" }).click();

    await page.locator("#title").fill("날짜 없는 제목");
    await page.locator("#content").fill("날짜를 고르지 않은 내용입니다.");

    await fillLocation(page);
    await page.waitForURL("**/write/post?type=lost");

    const submitButton = page.getByRole("button", { name: "작성 완료" });
    await expect(submitButton).toBeDisabled();

    await selectToday(page);
    await expect(submitButton).not.toBeDisabled();
  });

  test("POST 요청에 선택한 날짜가 담겨 전송된다", async ({ page }) => {
    await setupCommonMocks(page);

    let capturedBody: string | null = null;
    await page.route("**/api/posts", async (route) => {
      if (route.request().method() === "POST") {
        capturedBody = route.request().postData();
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_POST_RESPONSE),
        });
      }
      return route.fallback();
    });

    await page.goto("/write/post?type=lost");

    await page.getByRole("button", { name: "카테고리 선택" }).click();
    await page.getByText("전자기기").click();
    await page.getByRole("button", { name: "적용하기" }).click();

    await page.locator("#title").fill("날짜 검증 제목");
    await page.locator("#content").fill("날짜가 요청에 담기는지 확인하는 내용입니다.");

    await selectToday(page);

    await fillLocation(page);
    await page.waitForURL("**/write/post?type=lost");

    await page.getByRole("button", { name: "작성 완료" }).click();
    await page.getByRole("button", { name: "이미지 없이 등록" }).click();
    await page.waitForURL("**/list/999");

    expect(capturedBody).not.toBeNull();

    const jsonStringMatch = capturedBody!.match(/\{[\s\S]*"title"[\s\S]*\}/);
    expect(jsonStringMatch).not.toBeNull();

    const requestData = JSON.parse(jsonStringMatch![0]);
    // 타임존 표기가 없는 로컬 날짜·시간이어야 한다. 시·분·초는 제출 시각에서 온다.
    expect(requestData.date).toMatch(new RegExp(`^${todayYmd()}T\\d{2}:\\d{2}:\\d{2}$`));
  });

  test("유효하지 않은 type 파라미터로 진입 시 404 페이지를 보여준다", async ({ page }) => {
    await setupCommonMocks(page);
    await page.goto("/write/post?type=invalid");
    await expect(page.getByText("페이지를 찾을 수 없습니다.")).toBeVisible();
  });

  test("인증되지 않은 사용자는 로그인 페이지로 리다이렉트된다", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto("/write/post?type=lost");
    await page.waitForURL("**/login**");
    await expect(page).toHaveURL(/\/login/);
  });
});
