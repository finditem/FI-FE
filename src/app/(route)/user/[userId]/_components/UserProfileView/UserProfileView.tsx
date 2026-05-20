"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Tab } from "@/components/domain";
import { useGetUserProfileById, UserTabType, UserUpperTabType } from "@/api/fetch/user";
import UserHeader from "../UserHeader/UserHeader";
import TabContents from "../TabContents/TabContents";
import { USER_TABS } from "../USER_TABS";
import { useUserProfileTabQuery } from "../../_hooks/useUserProfileTabQuery/useUserProfileTabQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";

const upperCase = (tab: UserTabType): UserUpperTabType => {
  return tab.toUpperCase() as UserUpperTabType;
};

const UserProfileView = () => {
  const { userId } = useParams<{ userId: string }>();

  const { tab, updateTabQuery } = useUserProfileTabQuery();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserProfileById(userId, upperCase(tab));
  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isError || !userId) return notFound();
  const profileData = data?.profile;
  const listData = data?.list;

  return (
    <div className="h-base">
      <h1 className="sr-only">{profileData ? `${profileData.nickname} 프로필` : "프로필"}</h1>

      <UserHeader data={profileData} />

      <Tab tabs={USER_TABS} selected={tab} onValueChange={updateTabQuery} aria-label="프로필 탭" />

      <TabContents selectedTab={tab} data={listData} isLoading={isLoading} />

      <div ref={ref} className="h-10 w-full" />
    </div>
  );
};

export default UserProfileView;
