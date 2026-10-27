import { routing } from "@/i18n/routing";

/**
 * 인증 경로 판별에 사용할 로케일과 로케일 접두사를 제거한 경로를 반환합니다.
 * @param pathname - 쿼리를 제외한 현재 경로입니다.
 * @example
 * getAuthRoute("/en/chat"); // { locale: "en", pathname: "/chat" }
 */
export const getAuthRoute = (pathname: string) => {
  const locale =
    routing.locales.find(
      (supportedLocale) =>
        pathname === `/${supportedLocale}` || pathname.startsWith(`/${supportedLocale}/`)
    ) ?? routing.defaultLocale;
  const localePrefix = `/${locale}`;

  if (pathname === localePrefix) return { locale, pathname: "/" };
  if (pathname.startsWith(`${localePrefix}/`)) {
    return { locale, pathname: pathname.slice(localePrefix.length) };
  }
  return { locale, pathname };
};
