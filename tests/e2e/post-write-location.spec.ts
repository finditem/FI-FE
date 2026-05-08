import { test, expect, Page, BrowserContext } from "@playwright/test";

const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

const MOCK_VWORLD_RESULTS = {
  response: {
    status: "OK",
    result: {
      items: [
        {
          address: {
            road: "서울특별시 중구 세종대로 110",
            parcel: "서울특별시 중구 태평로1가 31",
          },
          point: { x: "126.977918341", y: "37.566370748" },
        },
        {
          address: {
            road: "서울특별시 강남구 테헤란로 521",
            parcel: "서울특별시 강남구 삼성동 159",
          },
          point: { x: "127.061493", y: "37.511574" },
        },
      ],
    },
  },
};

const MOCK_VWORLD_EMPTY = {
  response: {
    status: "NOT_FOUND",
  },
};

async function setupMocks(page: Page, context: BrowserContext) {
  await context.addCookies([
    { name: "refresh_token", value: "fake-token", domain: "localhost", path: "/" },
  ]);

  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );

  await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());
  await page.route("**/dapi.kakao.com/**", (route) => route.abort());
}

test.describe("게시글 위치 선택 페이지", () => {
  test("초기 진입 시 주소 검색 입력창이 표시된다", async ({ page, context }) => {
    await setupMocks(page, context);
    await page.goto("/write/post/location");

    await expect(page.getByPlaceholder("지역명을 입력해 주세요.")).toBeVisible();
    await expect(page.getByText("읍/면/동/리를 검색해 보세요.").last()).toBeVisible();
  });

  test("검색어 입력 시 VWorld 주소 검색 결과가 표시된다", async ({ page, context }) => {
    await setupMocks(page, context);
    await page.route("**/api/vworld**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_VWORLD_RESULTS),
      })
    );

    await page.goto("/write/post/location");

    const input = page.getByPlaceholder("지역명을 입력해 주세요.");
    await input.fill("서울");

    await expect(page.getByText("서울특별시 중구 세종대로 110")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("서울특별시 강남구 테헤란로 521")).toBeVisible();
  });

  test("검색 결과가 없을 때 안내 문구가 표시된다", async ({ page, context }) => {
    await setupMocks(page, context);
    await page.route("**/api/vworld**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_VWORLD_EMPTY),
      })
    );

    await page.goto("/write/post/location");

    const input = page.getByPlaceholder("지역명을 입력해 주세요.");
    await input.fill("존재하지않는주소");

    await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible({ timeout: 5000 });
  });

  test("검색 결과 클릭 시 지도와 거리 선택 UI로 전환된다", async ({ page, context }) => {
    await setupMocks(page, context);
    await page.route("**/api/vworld**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_VWORLD_RESULTS),
      })
    );

    await page.goto("/write/post/location");

    const input = page.getByPlaceholder("지역명을 입력해 주세요.");
    await input.fill("서울");

    await page.getByText("서울특별시 중구 세종대로 110").click({ timeout: 5000 });

    await expect(page).toHaveURL(/location=/, { timeout: 5000 });
    await expect(page.getByRole("button", { name: "적용하기" })).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("radio", { name: "1km" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "3km" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "5km" })).toBeVisible();
  });

  test("location 파라미터가 있을 때 거리 선택 화면이 표시된다", async ({ page, context }) => {
    await setupMocks(page, context);
    const url =
      "/write/post/location?location=" +
      encodeURIComponent("세종대로") +
      "&lat=37.566370748&lng=126.977918341";
    await page.goto(url);

    await expect(page.getByText("세종대로 근처")).toBeVisible();
    await expect(page.getByRole("button", { name: "적용하기" })).toBeVisible();
  });

  test("거리 선택 버튼 클릭 시 선택 상태가 변경된다", async ({ page, context }) => {
    await setupMocks(page, context);
    const url =
      "/write/post/location?location=" +
      encodeURIComponent("세종대로") +
      "&lat=37.566370748&lng=126.977918341";
    await page.goto(url);

    const btn1km = page.getByRole("radio", { name: "1km" });
    await btn1km.click();

    await expect(btn1km).toHaveAttribute("aria-checked", "true");
  });
});
