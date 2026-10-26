import { getSessionExpiredLoginUrl, isProtectedRoute } from "./authRoutes";

it.each(["/chat", "/alert", "/mypage/account", "/en/chat", "/en/alert", "/ko/write"])(
  "%s의 세션 만료 시 로그인으로 이동한다",
  (path) => {
    expect(isProtectedRoute(path)).toBe(true);
  }
);
it.each(["/", "/mypage", "/en/mypage", "/chatbot", "/writeup", "/alerts"])(
  "%s를 보호 경로로 오인하지 않는다",
  (path) => {
    expect(isProtectedRoute(path)).toBe(false);
  }
);
it("영어 경로와 쿼리를 보존한다", () => {
  const url = new URL(getSessionExpiredLoginUrl("/en/chat", "?type=ALL"), "https://finditem.kr");
  expect(url.pathname).toBe("/en/login");
  expect(url.searchParams.get("callbackUrl")).toBe("/chat?type=ALL");
});
