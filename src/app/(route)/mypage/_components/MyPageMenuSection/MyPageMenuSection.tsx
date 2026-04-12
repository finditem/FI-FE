"use client";

import React, { Fragment } from "react";
import { Icon } from "@/components/common";
import Link from "next/link";
import { MYPAGE_MENU_LIST } from "../../_constants/MYPAGE_ROUTE_CONFIG";
import { cn } from "@/utils";

const MyPageMenuSection = ({
  isUserLogin,
  disabled,
}: {
  isUserLogin: boolean;
  disabled?: boolean;
}) => {
  const visibleMenuList = MYPAGE_MENU_LIST.filter((menu) => {
    if (!isUserLogin && menu.title === "서비스 정책") {
      return false;
    }
    return true;
  });

  return visibleMenuList.map((menu, index) => (
    <Fragment key={menu.title}>
      <div className="flex w-full flex-col gap-3 px-5 py-6">
        <div className="flex text-body2-regular text-layout-body-default">{menu.title}</div>

        {menu.pages.map((item) => (
          <Fragment key={item.pageName}>
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
