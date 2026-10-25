import { test, expect } from "@playwright/test";

test.describe("존재하지 않는 경로", () => {
  test("한국어 경로로 진입 시 404 상태와 브랜드 404 페이지를 보여준다", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("페이지를 찾을 수 없습니다.")).toBeVisible();
  });

  test("영어 경로로 진입 시 404 상태와 영어 브랜드 404 페이지를 보여준다", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found.")).toBeVisible();
  });
});
