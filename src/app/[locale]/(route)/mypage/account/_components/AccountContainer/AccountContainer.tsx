"use client";

import { useGetUsersMe } from "@/api/fetch/user";
import { Icon, ProfileAvatar } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useLogout } from "@/hooks";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAccountRoute } from "../../_hooks/useAccountRoute/useAccountRoute";

const AccountContainer = () => {
  const t = useTranslations("AccountContainer");
  const accountRoute = useAccountRoute();
  const { data: profileData, isError } = useGetUsersMe();
  const { addToast } = useToast();

  if (isError) {
    addToast(t("profileLoadError"), "warning");
  }

  const { profileImg, nickname, email } = profileData?.result ?? {
    profileImg: "",
    nickname: t("defaultNickname"),
    email: t("defaultEmail"),
  };
  const { handleLogout, isPending } = useLogout();

  return (
    <div className="w-full h-base">
      <div className="w-full gap-6 px-5 py-[30px] flex-col-center">
        <ProfileAvatar size={60} src={profileImg} />

        <div className="flex w-full flex-col items-center">
          <span className="w-full truncate text-center text-body1-semibold text-layout-header-default">
            {nickname}
          </span>
          <span className="w-full truncate text-center text-body2-regular text-layout-body-default">
            {email}
          </span>
        </div>
      </div>

      <hr className="mx-5 max-w-full border-0 border-t-[0.5px] border-solid border-divider-default_3" />

      <div className="flex w-full flex-col gap-3 px-5 py-6">
        {accountRoute.map((item) => (
          <Link
            href={item.pageLink}
            key={item.key}
            className="flex w-full justify-between py-[10px] text-body1-semibold text-neutral-strong-default"
          >
            {item.pageName}
            <Icon name="ArrowRightSmall" size={24} className="text-neutral-strong-default" />
          </Link>
        ))}

        <button
          className="mt-[6px] flex w-full py-[10px] text-body1-semibold text-neutral-strong-default"
          onClick={handleLogout}
          disabled={isPending}
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
};

export default AccountContainer;
