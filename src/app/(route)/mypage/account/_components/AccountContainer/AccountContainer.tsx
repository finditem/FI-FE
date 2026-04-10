"use client";

import { useGetUsersMe } from "@/api/fetch/user";
import { Icon, ProfileAvatar } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { useLogout } from "@/hooks";
import Link from "next/link";
import { ACCOUNT_ROUTE } from "../../_constant/ACCOUNT_ROUTE";

const AccountContainer = () => {
  const { data: profileData, isError } = useGetUsersMe();
  const { addToast } = useToast();

  if (isError) {
    addToast("프로필 조회에 실패했어요", "warning");
  }

  const { profileImg, nickname, email } = profileData?.result ?? {
    profileImg: "",
    nickname: "사용자 닉네임",
    email: "사용자 이메일",
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
        {ACCOUNT_ROUTE.map((item) => (
          <Link
            href={item.pageLink}
            key={item.pageName}
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
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default AccountContainer;
