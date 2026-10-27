"use client";

import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useGetUsersMe } from "@/api/fetch/user";
import { useHiddenPath } from "@/hooks";
import { getPathname, usePathname } from "@/i18n/navigation";
import { FOOTER_LINK, type FooterLinkHref } from "../_constants/CONST_FOOTER";
import useLoginNoticeTimer from "./useLoginNoticeTimer";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";

type FooterLinkItem = (typeof FOOTER_LINK)[number];

interface FooterNavItem {
  key: FooterLinkHref;
  link: FooterLinkItem;
  label: string;
  href: FooterLinkHref;
  linkHref: string;
  isActive: string | undefined;
  isLoginRequiredDisabled: boolean;
  showLoginRequiredNotice: boolean;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * 현재 인증 상태에 따라 Footer 이동과 로그인 안내 표시를 관리합니다.
 * @remarks 확인 중·일시 장애에는 이동을 보류하되 로그인 필요 안내는 표시하지 않습니다.
 * @param hasToken - 초기 사용자 조회에만 사용하는 서버 쿠키 힌트입니다.
 * @returns Footer 표시 여부와 링크별 상태·클릭 핸들러를 반환합니다.
 * @example
 * const { isHidden, items } = useFooterNav(hasToken);
 */
const useFooterNav = (hasToken: boolean) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Footer");
  const isHidden = useHiddenPath();

  useGetUsersMe(hasToken);
  const status = useAuthStore((state) => state.status);
  const isLoggedIn = status === "authenticated";

  const { loginNoticeFor, setLoginNoticeFor } = useLoginNoticeTimer();

  const getActiveClassName = (href: FooterLinkHref) =>
    pathname === href ? "text-neutral-strong-focused" : undefined;

  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, link: FooterLinkItem) => {
    if (!link.requiresLogin) return;
    if (isLoggedIn) return;

    event.preventDefault();
    if (status !== "anonymous") return;
    if (loginNoticeFor === link.href) return;
    setLoginNoticeFor(link.href);
  };

  const items: FooterNavItem[] = FOOTER_LINK.map((link) => {
    const { href } = link;
    const isLoginRequiredDisabled = link.requiresLogin && !isLoggedIn;

    return {
      key: link.href,
      link,
      label: t(link.labelKey),
      href,
      linkHref: getPathname({ locale, href }),
      isActive: getActiveClassName(href),
      isLoginRequiredDisabled,
      showLoginRequiredNotice: isLoginRequiredDisabled && loginNoticeFor === link.href,
      onClick: (event) => handleItemClick(event, link),
    };
  });

  return { isHidden, items };
};

export default useFooterNav;
