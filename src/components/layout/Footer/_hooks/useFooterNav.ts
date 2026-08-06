"use client";

import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useGetUsersMe } from "@/api/fetch/user";
import { useHiddenPath } from "@/hooks";
import { getPathname, usePathname } from "@/i18n/navigation";
import { FOOTER_LINK, type FooterLinkHref } from "../_constants/CONST_FOOTER";
import useLoginNoticeTimer from "./useLoginNoticeTimer";

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

const useFooterNav = (hasToken: boolean) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Footer");
  const isHidden = useHiddenPath();

  const { data: userData, isError } = useGetUsersMe(hasToken);
  const isLoggedIn = !!userData && !isError;
  const isUserRole = userData?.result?.role ?? "USER";

  const { loginNoticeFor, setLoginNoticeFor } = useLoginNoticeTimer();

  const getActiveClassName = (href: FooterLinkHref) =>
    pathname === href ? "text-neutral-strong-focused" : undefined;

  const getTargetHref = (link: FooterLinkItem): FooterLinkHref => {
    const isMypage = link.href === "/mypage";
    const canUseAdminHref =
      isMypage && isUserRole === "ADMIN" && "adminHref" in link && !!link.adminHref;

    return canUseAdminHref ? (link.adminHref as FooterLinkHref) : link.href;
  };

  const handleItemClick = (e: MouseEvent<HTMLAnchorElement>, link: FooterLinkItem) => {
    if (!link.requiresLogin) return;
    if (isLoggedIn) return;

    e.preventDefault();
    if (loginNoticeFor === link.href) return;
    setLoginNoticeFor(link.href);
  };

  const items: FooterNavItem[] = FOOTER_LINK.map((link) => {
    const href = getTargetHref(link);
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
      onClick: (e) => handleItemClick(e, link),
    };
  });

  return { isHidden, items };
};

export default useFooterNav;
