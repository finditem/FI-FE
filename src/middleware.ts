import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getAdminUrl } from "@/utils/getAdminUrl/getAdminUrl";
import { clearAuthCookies } from "@/utils/authCookies/authCookies";
import { isProtectedRoute } from "@/utils/authRoutes/authRoutes";

const intlMiddleware = createIntlMiddleware(routing);

const stripLocalePrefix = (pathname: string) => {
  const match = routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (!match) return { locale: routing.defaultLocale, pathname };

  const stripped = pathname.slice(`/${match}`.length) || "/";
  return { locale: match, pathname: stripped };
};

const withLocalePrefix = (locale: string, pathname: string) =>
  locale === routing.defaultLocale ? pathname : `/${locale}${pathname}`;

function handleRequest(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const refreshToken = request.cookies.has("refresh_token");

  const { locale, pathname: currentPath } = stripLocalePrefix(request.nextUrl.pathname);

  // 관리자 화면은 별도 앱으로 분리되었으므로 예전 주소로 들어오면 관리자 앱으로 보낸다.
  if (currentPath === "/admin" || currentPath.startsWith("/admin/")) {
    return NextResponse.redirect(getAdminUrl(currentPath + request.nextUrl.search));
  }

  const buildRedirectUrl = (targetPath: string) =>
    new URL(withLocalePrefix(locale, targetPath), request.url);

  const isAuthPath = currentPath.startsWith("/login") || currentPath.startsWith("/sign-up");

  const isProtectPath = isProtectedRoute(currentPath);

  const isSessionExpired = request.nextUrl.searchParams.get("reason") === "session-expired";

  // 세션 완료 시 로그인 페이지로 진입 했을 때 모든 토큰 제거
  if (isAuthPath && isSessionExpired) {
    return clearAuthCookies(intlResponse, request.headers.get("host"));
  }

  // 쿠키의 존재만으로 로그인 화면을 막으면 서버에서 만료된 세션이 재로그인할 수 없다.

  // 리프레쉬 토큰이 없는 상황에서 보호된 페이지 접근하려고 할 때 로그인 페이지로 리다이렉트
  if (isProtectPath && !refreshToken) {
    const loginUrl = buildRedirectUrl("/login");
    loginUrl.searchParams.set("callbackUrl", currentPath + request.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

const LOCALE_SESSION_COOKIE = "locale_session";

const hasLocalePrefix = (pathname: string) =>
  routing.locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

export function middleware(request: NextRequest) {
  const fetchDest = request.headers.get("sec-fetch-dest");
  const isPageRequest = fetchDest == null || fetchDest === "document";

  if (request.cookies.has(LOCALE_SESSION_COOKIE) || !isPageRequest) {
    return handleRequest(request);
  }

  const { pathname, search } = request.nextUrl;
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const shouldRestoreLocale =
    hasLocale(routing.locales, savedLocale) &&
    savedLocale !== routing.defaultLocale &&
    !hasLocalePrefix(pathname);

  const response = shouldRestoreLocale
    ? NextResponse.redirect(
        new URL(`/${savedLocale}${pathname === "/" ? "" : pathname}${search}`, request.url)
      )
    : handleRequest(request);

  // 앞서 추가한 서로 다른 Domain의 토큰 삭제 헤더도 보존한다.
  response.headers.append("Set-Cookie", `${LOCALE_SESSION_COOKIE}=1; Path=/`);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
