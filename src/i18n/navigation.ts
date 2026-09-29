import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

/**
 * 언어를 바꿔 페이지를 새로 불러옵니다.
 *
 * @remarks
 * - 네이버 지도 스크립트는 페이지당 한 번 로드되어 언어가 고정됩니다. 라우터로 이동하면 지도 언어가 바뀌지 않으므로 하드 내비게이션을 씁니다.
 *
 * @param href - 이동할 경로(로케일 접두사 제외)
 * @param locale - 바꿀 언어
 * @param search - 유지할 쿼리 문자열(`?` 제외)
 */
export const reloadWithLocale = (
  href: string,
  locale: (typeof routing.locales)[number],
  search = ""
) => {
  // next-intl 라우터가 언어를 바꿀 때 하는 것처럼 언어 쿠키를 먼저 맞춘다.
  // 하지 않으면 미들웨어가 이전 언어 쿠키를 보고 원래 언어 주소로 되돌려 보낸다.
  document.cookie = `NEXT_LOCALE=${locale}; path=/; SameSite=Lax`;

  const pathname = getPathname({ href, locale });
  window.location.assign(search ? `${pathname}?${search}` : pathname);
};
