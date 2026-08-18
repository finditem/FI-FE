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

  const visibleMenuList = menuList.filter((menu) => {
    if (!isUserLogin && menu.key === "servicePolicy") {
      return false;
    }
    return true;
  });

  const { handleLogout, isPending } = useLogout();

  return visibleMenuList.map((menu, index) => (
    <Fragment key={menu.key}>
      <div className="flex w-full flex-col gap-3 px-5 py-6">
        <div className="flex text-body2-regular text-layout-body-default">{menu.title}</div>

        {menu.pages.map((item) => (
          <Fragment key={item.key}>
            <Link
              href={item.pageLink}
              className={cn(
                "flex w-full justify-between py-[10px] text-body1-semibold text-neutral-strong-default",
                disabled && "pointer-events-none"
              )}
            >
              {item.pageName}
              <Icon name="ArrowRightSmall" size={24} className="text-neutral-strong-default" />
            </Link>
            {isUserLogin && item.key === "accountSettings" && (
              <button
                className="flex w-full py-[10px] text-body1-semibold text-neutral-strong-default"
                onClick={handleLogout}
                disabled={isPending || disabled}
              >
                {t("logout")}
              </button>
            )}
          </Fragment>
        ))}
      </div>

      {index !== visibleMenuList.length - 1 && (
        <hr className="mx-5 max-w-full border-0 border-t-[0.5px] border-solid border-divider-default_3" />
      )}
    </Fragment>
  ));
};

export default MyPageMenuSection;
