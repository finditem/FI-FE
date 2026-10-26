import { routing } from "@/i18n/routing";

export const getAuthRoute = (pathname: string) => {
  const locale =
    routing.locales.find(
      (value) => pathname === `/${value}` || pathname.startsWith(`/${value}/`)
    ) ?? routing.defaultLocale;
  const prefix = `/${locale}`;
  const path =
    pathname === prefix
      ? "/"
      : pathname.startsWith(`${prefix}/`)
        ? pathname.slice(prefix.length)
        : pathname;
  return { locale, pathname: path };
};

const matches = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

export const isAuthRoute = (pathname: string) => {
  const path = getAuthRoute(pathname).pathname;
  return matches(path, "/login") || matches(path, "/sign-up") || matches(path, "/auth");
};

export const isProtectedRoute = (pathname: string) => {
  const path = getAuthRoute(pathname).pathname;
  // /mypage는 게스트에게도 로그인 안내를 제공한다.
  return (
    path.startsWith("/mypage/") ||
    ["/write", "/chat", "/alert", "/change-password"].some((base) => matches(path, base))
  );
};

export const getSessionExpiredLoginUrl = (pathname: string, search: string) => {
  const route = getAuthRoute(pathname);
  const prefix = route.locale === routing.defaultLocale ? "" : `/${route.locale}`;
  const params = new URLSearchParams({
    reason: "session-expired",
    callbackUrl: route.pathname + search,
  });
  return `${prefix}/login?${params}`;
};
