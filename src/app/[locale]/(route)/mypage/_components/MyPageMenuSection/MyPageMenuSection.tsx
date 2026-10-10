"use client";

import React, { Fragment } from "react";
import { Icon } from "@/components";
import Link from "next/link";
import { cn } from "@/utils";
import { useLogout } from "@/hooks";
import { useTranslations } from "next-intl";
import { useMypageMenuList } from "../../_hooks/useMypageMenuList/useMypageMenuList";

const MyPageMenuSection = ({
  isUserLogin,
  disabled,
}: {
  isUserLogin: boolean;
  disabled?: boolean;
}) => {
  const t = useTranslations("MyPageMenu");
  const menuList = useMypageMenuList();

  // 비로그인 사용자에게는 서비스 정책 중 공지사항만 노출한다.
  const visibleMenuList = isUserLogin
    ? menuList
    : menuList.map((menu) =>
        menu.key === "servicePolicy"
          ? { ...menu, pages: menu.pages.filter((page) => page.key === "notice") }
          : menu
      );

  const { handleLogout, isPending } = useLogout();

  const rowClassName =
    "flex h-11 w-full items-center justify-between px-4 text-body1-semibold text-neutral-strong-default";

  return visibleMenuList.map((menu) => (
    <div key={menu.key} className="flex w-full flex-col gap-[2px] rounded-[16px] bg-white pb-4">
      <div className="flex p-4 text-h3-semibold text-layout-header-default">{menu.title}</div>

      {menu.pages.map((item) => (
        <Fragment key={item.key}>
          <Link
            href={item.pageLink}
            className={cn(rowClassName, disabled && "pointer-events-none")}
          >
            {item.pageName}
            <Icon name="ArrowRightSmall" size={24} className="text-neutral-strong-default" />
          </Link>
          {isUserLogin && item.key === "accountSettings" && (
            <button
              className={rowClassName}
              onClick={handleLogout}
              disabled={isPending || disabled}
            >
              {t("logout")}
              <Icon name="ArrowRightSmall" size={24} className="text-neutral-strong-default" />
            </button>
          )}
        </Fragment>
      ))}
    </div>
  ));
};

export default MyPageMenuSection;
