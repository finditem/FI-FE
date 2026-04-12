"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import MyPageProfile from "../MyPageProfile/MyPageProfile";
import MyPageIconNav from "../MyPageIconNav/MyPageIconNav";
import MyPageMenuSection from "../MyPageMenuSection/MyPageMenuSection";
import { useGetUsersMe } from "@/api/fetch/user";

const MyPageContainer = ({ hasToken }: { hasToken: boolean }) => {
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
      addToast("예상치 못한 에러가 발생했어요", "error");
    }
  }, [error, addToast]);

  const userData = data?.result
    ? {
        email: data.result.email,
        profileImg: data.result.profileImg || "",
        nickname: data.result.nickname,
      }
    : undefined;

  return (
    <div className="flex w-full flex-col h-f-base">
      <MyPageProfile userData={userData} loading={isFetching} />

      <MyPageIconNav disabled={isFetching} />

      <MyPageMenuSection isUserLogin={!!userData} disabled={isFetching} />
    </div>
  );
};

export default MyPageContainer;
