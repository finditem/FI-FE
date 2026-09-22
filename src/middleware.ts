import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { getAdminUrl } from "@/utils/getAdminUrl/getAdminUrl";

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

export function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.has("refresh_token");

  const { locale, pathname: currentPath } = stripLocalePrefix(request.nextUrl.pathname);

  // 관리자 화면은 별도 앱으로 분리되었으므로 예전 주소로 들어오면 관리자 앱으로 보낸다.
  if (currentPath === "/admin" || currentPath.startsWith("/admin/")) {
    return NextResponse.redirect(getAdminUrl(currentPath + request.nextUrl.search));
  }

  const buildRedirectUrl = (targetPath: string) =>
    new URL(withLocalePrefix(locale, targetPath), request.url);

  const isAuthPath = currentPath.startsWith("/login") || currentPath.startsWith("/sign-up");

  const isProtectPath =
    currentPath.startsWith("/mypage/") ||
    currentPath.startsWith("/write") ||
    currentPath.startsWith("/chat") ||
    currentPath.startsWith("/change-password") ||
    currentPath.startsWith("/alert");

  const isSessionExpired = request.nextUrl.searchParams.get("reason") === "session-expired";

  // 세션 완료 시 로그인 페이지로 진입 했을 때 모든 토큰 제거
  if (isAuthPath && isSessionExpired) {
    intlResponse.cookies.set("access_token", "", { path: "/", maxAge: 0 });
    intlResponse.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
    return intlResponse;
  }

  // 엑세스 토큰이 있는데 로그인, 회원가입 페이지에 접근하려고 할때 마이페이지로 리다이렉트 (리프레쉬 토큰 만료됐을때는 제외)
  const RedirectMypage = isAuthPath && accessToken && refreshToken && !isSessionExpired;
  if (RedirectMypage) {
    return NextResponse.redirect(buildRedirectUrl("/mypage"));
  }

  // 리프레쉬 토큰이 없는 상황에서 보호된 페이지 접근하려고 할 때 로그인 페이지로 리다이렉트
  if (isProtectPath && !refreshToken) {
    const loginUrl = buildRedirectUrl("/login");
    loginUrl.searchParams.set("callbackUrl", currentPath + request.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
