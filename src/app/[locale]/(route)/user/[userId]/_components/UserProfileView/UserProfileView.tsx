"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Tab } from "@/components";
import { useGetUserProfileById, UserTabType, UserUpperTabType } from "@/api/fetch/user";
import UserHeader from "../UserHeader/UserHeader";
import TabContents from "../TabContents/TabContents";
import { useUserProfileTabQuery } from "../../_hooks/useUserProfileTabQuery/useUserProfileTabQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";
import { useTranslations } from "next-intl";

const upperCase = (tab: UserTabType): UserUpperTabType => {
  return tab.toUpperCase() as UserUpperTabType;
};

const UserProfileView = () => {
  const t = useTranslations("UserProfilePage");
  const { userId } = useParams<{ userId: string }>();
  const tabs = [
    { key: "posts", label: t("tabs.posts") },
    { key: "comments", label: t("tabs.comments") },
    { key: "favorites", label: t("tabs.favorites") },
  ] as const;

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
      <h1 className="sr-only">
        {profileData ? t("profileTitle", { nickname: profileData.nickname }) : t("profile")}
      </h1>

      <UserHeader data={profileData} />

      <Tab
        tabs={tabs}
        selected={tab}
        onValueChange={updateTabQuery}
        aria-label={t("profileTabsAriaLabel")}
      />

      <TabContents selectedTab={tab} data={listData} isLoading={isLoading} />

      <div ref={ref} className="h-10 w-full" />
    </div>
  );
};

export default UserProfileView;
