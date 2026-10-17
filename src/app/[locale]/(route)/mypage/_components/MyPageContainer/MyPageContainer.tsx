"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import MyPageProfile from "../MyPageProfile/MyPageProfile";
import MyPageIconNav from "../MyPageIconNav/MyPageIconNav";
import MyPageMenuSection from "../MyPageMenuSection/MyPageMenuSection";
import MyPageTemperatureCard from "../MyPageTemperatureCard/MyPageTemperatureCard";
import { FIRST_TEMPERATURE } from "../../_constants/TEMPERATURE";
import { useGetUsersMe } from "@/api/fetch/user";
import { useTranslations } from "next-intl";

const MyPageContainer = ({ hasToken }: { hasToken: boolean }) => {
  const t = useTranslations("MyPageContainer");
  const { data, isFetching, error } = useGetUsersMe(hasToken);
  const { addToast } = useToast();

  useEffect(() => {
    if (!error) return;

    const errorCode = error?.response?.data.code;
    if (
      errorCode === "USER404-NOT_FOUND" ||
      errorCode === "COMMON401" ||
      errorCode === "AUTH401-INVALID_REFRESH"
    ) {
      // noop
    } else {
      addToast(t("unexpectedError"), "error");
    }
  }, [error, addToast, t]);

  const userData = data?.result
    ? {
        email: data.result.email,
        profileImg: data.result.profileImg || "",
        nickname: data.result.nickname,
      }
    : undefined;

  return (
    <div className="flex w-full flex-col gap-3 bg-layout_2depth px-4 pb-4 pt-[calc(16px+var(--safe-area-top))] h-f-base">
      <MyPageProfile userData={userData} loading={isFetching} />

      {/* TODO(준열): 백엔드가 유저 정보에 찾길 온도를 추가하면 기본값 대신 그 값을 넘긴다. */}
      {userData && <MyPageTemperatureCard temperature={FIRST_TEMPERATURE} />}

      <MyPageIconNav disabled={isFetching} />

      <MyPageMenuSection isUserLogin={!!userData} disabled={isFetching} />
    </div>
  );
};

export default MyPageContainer;
