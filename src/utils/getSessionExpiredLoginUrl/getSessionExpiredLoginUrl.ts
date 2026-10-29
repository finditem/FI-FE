import { routing } from "@/i18n/routing";
import { getAuthRoute } from "../getAuthRoute/getAuthRoute";

/**
 * 언어와 원래 경로·쿼리를 보존하는 세션 만료 로그인 URL을 생성합니다.
 * @param pathname - 세션이 만료된 화면의 경로입니다.
 * @param search - 물음표를 포함한 쿼리이며, 쿼리가 없으면 빈 문자열입니다.
 *
 * @author suhyeon
 *
 * @example
 * getSessionExpiredLoginUrl("/en/chat", "?tab=all");
 */
export const getSessionExpiredLoginUrl = (pathname: string, search: string): string => {
  const route = getAuthRoute(pathname);
  const localePrefix = route.locale === routing.defaultLocale ? "" : `/${route.locale}`;
  const searchParams = new URLSearchParams({
    reason: "session-expired",
    callbackUrl: route.pathname + search,
  });
  return `${localePrefix}/login?${searchParams}`;
};
