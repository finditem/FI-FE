"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Tab } from "@/components";
import { useGetUserProfileById, UserUpperTabType } from "@/api/fetch/user";
import UserHeader from "../UserHeader/UserHeader";
import TabContents from "../TabContents/TabContents";
import { useUserProfileTabQuery } from "../../_hooks/useUserProfileTabQuery/useUserProfileTabQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";
import { useTranslations } from "next-intl";
import type { UserProfileTabKey } from "../../_types/UserProfileTabType";

const upperCase = (tab: UserProfileTabKey): UserUpperTabType => {
  return tab.toUpperCase() as UserUpperTabType;
};

const UserProfileView = () => {
  const t = useTranslations("UserProfilePage");
  const { userId } = useParams<{ userId: string }>();
  const tabs = [
    { key: "posts", label: t("tabs.posts") },
    { key: "comments", label: t("tabs.comments") },
    { key: "favorites", label: t("tabs.favorites") },
    { key: "reviews", label: t("tabs.reviews") },
  ] as const;

  const { tab, updateTabQuery } = useUserProfileTabQuery();
  const isApiTab = tab !== "reviews";
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserProfileById(userId, upperCase(isApiTab ? tab : "posts"), 10, {
      enabled: isApiTab,
    });
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
