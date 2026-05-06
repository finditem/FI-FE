import { test, expect } from "@playwright/test";

test.describe("매뉴얼 페이지", () => {
  test("분실/발견/도난 탭이 표시된다", async ({ page }) => {
    await page.goto("/manual");

    await expect(page.getByRole("button", { name: "분실", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "발견", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "도난", exact: true })).toBeVisible();
  });

  test("분실 탭이 기본으로 선택되어 있고 분실 항목이 표시된다", async ({ page }) => {
    await page.goto("/manual");

    await expect(page.getByText("경찰청 신고 내역을 확인했나요?")).toBeVisible();
    await expect(page.getByText("분실 게시글을 써보셨나요?")).toBeVisible();
  });

  test("분실 항목 클릭 시 아코디언이 펼쳐진다", async ({ page }) => {
    await page.goto("/manual");

    const firstItem = page.getByRole("button", { name: "경찰청 신고 내역을 확인했나요?" });
    await expect(firstItem).toHaveAttribute("aria-expanded", "false");

    await firstItem.click();

    await expect(firstItem).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("경찰청 유실물 종합 포털").first()).toBeVisible();
  });

  test("열린 항목을 다시 클릭하면 아코디언이 닫힌다", async ({ page }) => {
    await page.goto("/manual");

    const firstItem = page.getByRole("button", { name: "경찰청 신고 내역을 확인했나요?" });
    await firstItem.click();
    await expect(firstItem).toHaveAttribute("aria-expanded", "true");

    await firstItem.click();
    await expect(firstItem).toHaveAttribute("aria-expanded", "false");
  });

  test("발견 탭 클릭 시 발견 항목이 표시된다", async ({ page }) => {
    await page.goto("/manual");

    await page.getByRole("button", { name: "발견", exact: true }).click();

    await expect(page.getByText("발견 게시글을 써보셨나요?")).toBeVisible();
    await expect(page.getByText("습득물 신고를 하셨나요?")).toBeVisible();
  });

  test("도난 탭 클릭 시 도난 항목이 표시된다", async ({ page }) => {
    await page.goto("/manual");

    await page.getByRole("button", { name: "도난", exact: true }).click();

    await expect(page.getByText("CCTV를 확인하고 싶으신가요?")).toBeVisible();
  });

  test("탭 전환 시 이전 탭의 열린 아코디언이 초기화된다", async ({ page }) => {
    await page.goto("/manual");

    await page.getByRole("button", { name: "경찰청 신고 내역을 확인했나요?" }).click();

    await page.getByRole("button", { name: "발견", exact: true }).click();
    await page.getByRole("button", { name: "분실", exact: true }).click();

    const firstItem = page.getByRole("button", { name: "경찰청 신고 내역을 확인했나요?" });
    await expect(firstItem).toHaveAttribute("aria-expanded", "false");
  });

  test("항목에 외부 링크 버튼이 표시된다", async ({ page }) => {
    await page.goto("/manual");

    await page.getByRole("button", { name: "경찰청 신고 내역을 확인했나요?" }).click();

    await expect(page.getByRole("link", { name: "경찰청 바로가기" })).toBeVisible({
      timeout: 3000,
    });
  });
});
