import { test, expect, type Page } from "@playwright/test";
import {
  MOCK_AUTH_ACCESS_COOKIE,
  MOCK_AUTH_COOKIE,
  MOCK_AUTH_EXPIRED_RESPONSE,
  MOCK_AUTH_LOGIN_FORM,
  MOCK_AUTH_LOGIN_RESPONSE,
  MOCK_AUTH_REFRESH_RESPONSE,
  MOCK_AUTH_USER,
} from "@/mock/data/auth.data";
import { MOCK_MARKER, MOCK_RECENT_FOUND_EMPTY } from "@/mock/data/main.data";
import { MOCK_CHAT_LIST_EMPTY_RESPONSE } from "@/mock/data/chat.data";

test.describe.configure({ timeout: 90_000 });

async function setupSession(page: Page, initiallyExpired = false) {
  let loggedIn = !initiallyExpired;
  await page.route("https://oapi.map.naver.com/**", (route) => route.abort());
  await page.route("**/api/auth/login", async (route) => {
    const domain = new URL(page.url()).hostname;
    await page.context().addCookies([
      { ...MOCK_AUTH_COOKIE, domain },
      { ...MOCK_AUTH_ACCESS_COOKIE, domain },
    ]);
    loggedIn = true;
    await route.fulfill({ json: MOCK_AUTH_LOGIN_RESPONSE });
  });
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: loggedIn ? 200 : 401,
      json: loggedIn ? MOCK_AUTH_REFRESH_RESPONSE : MOCK_AUTH_EXPIRED_RESPONSE,
    })
  );
  await page.route("**/api/users/me", (route) =>
    route.fulfill({
      status: loggedIn ? 200 : 401,
      json: loggedIn ? MOCK_AUTH_USER : MOCK_AUTH_EXPIRED_RESPONSE,
    })
  );
  await page.route("**/api/users/me/temperature", (route) => route.abort());
  await page.route("**/api/notifications/**", (route) => route.abort());
  await page.route("**/api/main/posts/marker**", (route) => route.fulfill({ json: MOCK_MARKER }));
  await page.route("**/api/main/posts/recent-found**", (route) =>
    route.fulfill({ json: MOCK_RECENT_FOUND_EMPTY })
  );
  await page.route("**/api/users/me/chats**", (route) =>
    route.fulfill({ json: MOCK_CHAT_LIST_EMPTY_RESPONSE })
  );
}

async function loginAndOpenChat(page: Page) {
  await page.getByPlaceholder("이메일을 입력해주세요.").fill(MOCK_AUTH_LOGIN_FORM.email);
  await page.getByPlaceholder("비밀번호를 입력해주세요.").fill(MOCK_AUTH_LOGIN_FORM.password);
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 45_000 });
  const chat = page.locator("footer nav").getByRole("link", { name: "채팅", exact: true });
  await expect(chat).toHaveAttribute("aria-disabled", "false");
  await chat.click();
  await expect(page).toHaveURL(/\/chat$/, { timeout: 45_000 });
  await expect(page.getByText("아직 채팅 내역이 없어요")).toBeVisible();
}

test("쿠키 없는 로그인 화면에서 로그인 후 메인 Footer로 바로 채팅에 진입한다", async ({ page }) => {
  await setupSession(page);
  await page.goto("/login/email");
  await loginAndOpenChat(page);
});

test("만료 쿠키가 남은 마이페이지에서 쿠키 정리 후 재로그인할 수 있다", async ({
  page,
  context,
  baseURL,
}) => {
  await setupSession(page, true);
  const domain = new URL(baseURL!).hostname;
  await context.addCookies([
    { ...MOCK_AUTH_COOKIE, domain },
    { ...MOCK_AUTH_ACCESS_COOKIE, domain },
  ]);
  await page.goto("/mypage");
  await expect
    .poll(
      async () =>
        (await context.cookies()).filter((c) => /^(access|refresh)_token$/.test(c.name)).length
    )
    .toBe(0);
  await page.goto("/login/email");
  await expect(page).toHaveURL(/\/login\/email$/);
  await loginAndOpenChat(page);
});

test("영문 채팅에서 refresh가 만료되면 언어와 복귀 경로를 보존한다", async ({
  page,
  context,
  baseURL,
}) => {
  await setupSession(page, true);
  const domain = new URL(baseURL!).hostname;
  await context.addCookies([
    { ...MOCK_AUTH_COOKIE, domain },
    { ...MOCK_AUTH_ACCESS_COOKIE, domain },
  ]);
  await page.goto("/en/chat?type=ALL");
  await expect(page).toHaveURL(/\/en\/login\?/, { timeout: 45_000 });
  const url = new URL(page.url());
  expect(url.searchParams.get("reason")).toBe("session-expired");
  expect(url.searchParams.get("callbackUrl")).toBe("/chat?type=ALL");
  expect(
    (await context.cookies()).filter((c) => /^(access|refresh)_token$/.test(c.name))
  ).toHaveLength(0);
});
