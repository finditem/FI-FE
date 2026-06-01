import { test, expect } from "@playwright/test";

test.describe("서비스 소개 페이지", () => {
  test("페이지 진입 시 주요 UI가 정상적으로 렌더링되고 CTA가 동작한다", async ({ page }) => {
    await page.goto("/hello");

    await expect(page.getByRole("heading", { name: "서비스소개 페이지" })).toBeVisible();

    await expect(page.locator("[data-testid='intro-section']")).toBeVisible();

    const ctaButton = page.getByRole("link", { name: "찾아줘 홈으로 이동" });
    await expect(ctaButton).toBeVisible();
    await ctaButton.scrollIntoViewIfNeeded();

    await ctaButton.click();

    await page.waitForURL("**/", { timeout: 10000 });
    await expect(page).toHaveURL("/");
  });
});
