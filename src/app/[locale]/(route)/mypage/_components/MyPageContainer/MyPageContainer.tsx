"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import MyPageProfile from "../MyPageProfile/MyPageProfile";
import MyPageIconNav from "../MyPageIconNav/MyPageIconNav";
import MyPageMenuSection from "../MyPageMenuSection/MyPageMenuSection";
import MyPageTemperatureCard from "../MyPageTemperatureCard/MyPageTemperatureCard";
import { useGetUsersMe, useGetUsersMeTemperature } from "@/api/fetch/user";
import { useTranslations } from "next-intl";

const MyPageContainer = ({ hasToken }: { hasToken: boolean }) => {
  const t = useTranslations("MyPageContainer");
  const { data, isFetching, error: usersMeError } = useGetUsersMe(hasToken);
  const { data: temperatureData, error: temperatureError } = useGetUsersMeTemperature(hasToken);
  // 두 요청이 함께 실패해도 토스트가 한 번만 뜨도록 하나로 합쳐 기존 에러 처리에 넘긴다.
  const error = usersMeError ?? temperatureError;
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

      {userData && <MyPageTemperatureCard temperature={temperatureData?.result?.temperature} />}

      <MyPageIconNav disabled={isFetching} />

      <MyPageMenuSection isUserLogin={!!userData} disabled={isFetching} />
    </div>
  );
};

export default MyPageContainer;
