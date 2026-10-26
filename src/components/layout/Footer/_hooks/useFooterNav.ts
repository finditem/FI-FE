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

  const handleItemClick = (e: MouseEvent<HTMLAnchorElement>, link: FooterLinkItem) => {
    if (!link.requiresLogin) return;
    if (isLoggedIn) return;

    e.preventDefault();
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
      onClick: (e) => handleItemClick(e, link),
    };
  });

  return { isHidden, items };
};

export default useFooterNav;
