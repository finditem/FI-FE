import { test, expect, Page } from "@playwright/test";

const POST_ID = 1;

async function setupMocks(page: Page) {
  await page.route("https://dapi.kakao.com/v2/maps/**", (route) => route.abort());
  await page.route("**/dapi.kakao.com/**", (route) => route.abort());
}

test.describe("게시글 지도 뷰 페이지", () => {
  test("페이지 헤더에 '분실/발견 위치' 제목이 표시된다", async ({ page }) => {
    await setupMocks(page);
    await page.goto(`/list/${POST_ID}/map`);

    await expect(page.locator("h2").filter({ hasText: "분실/발견 위치" })).toBeVisible();
  });

  test("지도 영역 섹션이 렌더링된다", async ({ page }) => {
    await setupMocks(page);
    await page.goto(`/list/${POST_ID}/map?lat=37.566370748&lng=126.977918341&radius=3000`);

    await expect(page.locator("h1").filter({ hasText: "분실/발견 위치" })).toBeAttached();
  });

  test("address 파라미터가 URL에 포함된 상태로 페이지가 로드된다", async ({ page }) => {
    await setupMocks(page);
    const address = encodeURIComponent("서울특별시 중구 세종대로 110");
    await page.goto(
      `/list/${POST_ID}/map?lat=37.566370748&lng=126.977918341&radius=3000&address=${address}`
    );

    await expect(page).toHaveURL(/address=/);
    await expect(page.locator("h2").filter({ hasText: "분실/발견 위치" })).toBeVisible();
  });
});
