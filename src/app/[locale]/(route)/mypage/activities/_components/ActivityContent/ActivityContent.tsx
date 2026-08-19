"use client";

import { Icon, MypageEmptyUI, LoadingState } from "@/components";
import { cn, highlightText } from "@/utils";
import { ACTIVITY_STYLE_CONFIG } from "../../_constants/ACTIVITY_STYLE_CONFIG";
import formatHHMM from "../../_utils/formatHHMM";
import { ActivityEachItemType, ActivityGroupItemType, useGetUserActivity } from "@/api/fetch/user";
import { useToast } from "@/context/ToastContext";
import { useFilterParams } from "@/hooks";
import { useInfiniteScroll } from "@/hooks";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface ActivityItemProps {
  activityItem: ActivityEachItemType;
  keyword?: string;
}

const ActivityItem = ({ activityItem, keyword }: ActivityItemProps) => {
  const t = useTranslations("ActivityContent");
  const { type, createdAt, title, content } = activityItem;

  const { bgColor, iconName, logTitleKey } = ACTIVITY_STYLE_CONFIG[type];

  return (
    <li className="group flex gap-[10px]">
      {/* 아이콘 영역 */}
      <div className="relative flex flex-col items-center">
        <div className={cn("size-9 rounded-full flex-center", bgColor)}>
          <Icon name={iconName} size={18} />
        </div>
        <hr
          className="h-[76px] w-[1px] border border-divider-default group-last:hidden"
          aria-hidden={true}
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="min-w-0 flex-1 px-5 pb-9">
        <time className="text-body2-regular text-layout-body-default">{formatHHMM(createdAt)}</time>
        <p className="mt-[6px] text-body1-semibold text-neutral-strong-default">{t(logTitleKey)}</p>
        <p className="mt-[2px] truncate text-body2-regular text-neutral-normal-default">
          {keyword ? highlightText(title, keyword) : title}
        </p>
      </div>
    </li>
  );
};

interface ActivityGroupItemProps {
  activityItem: ActivityGroupItemType;
  keyword?: string;
}

const ActivityGroupItem = ({ activityItem, keyword }: ActivityGroupItemProps) => {
  const { date, activities } = activityItem;

  return (
    <li className="flex flex-col gap-7 p-5">
      <h3 className="text-h3-semibold text-layout-header-default">{date}</h3>

      <ol className="flex flex-col">
        {activities.map((item) => (
          <ActivityItem key={item.id} activityItem={item} keyword={keyword} />
        ))}
      </ol>
    </li>
  );
};

const ActivityContent = () => {
  const t = useTranslations("ActivityContent");
  const { startDate, endDate, activity } = useFilterParams();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;

  const {
    data: activityData,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetUserActivity({
    type: activity,
    startDate,
    endDate,
    keyword,
  });

  const { addToast } = useToast();

  const { ref } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  useEffect(() => {
    if (isError) {
      addToast(t("loadError"), "error");
    }
  }, [isError, addToast, t]);

  if (isLoading) return <LoadingState />;

  return (
    <section>
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>

      {activityData && activityData.length === 0 ? (
        <MypageEmptyUI pageType="activity" />
      ) : (
        <>
          <ol className="flex flex-col">
            {activityData &&
              activityData.map((item, index) => (
                <ActivityGroupItem key={index} activityItem={item} keyword={keyword} />
              ))}
          </ol>

          <div ref={ref} className="h-10" />
        </>
      )}
    </section>
  );
};

export default ActivityContent;
