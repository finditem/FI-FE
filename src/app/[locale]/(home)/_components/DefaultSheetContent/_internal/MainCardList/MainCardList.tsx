"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { useFormatDate, useHorizontalDragScroll } from "@/hooks";
import Link from "next/link";
import Image from "next/image";
import RecentFoundItemSkeleton from "../RecentFoundItemSkeleton/RecentFoundItemSkeleton";

interface CardListData {
  postId: string;
  title: string;
  thumbnailImageUrl: string;
  createdAt: string;
}

interface MainCardItemProps {
  cardItemData: CardListData;
}

const MainCardItem = ({ cardItemData }: MainCardItemProps) => {
  const t = useTranslations("MainCardList");
  const formatDate = useFormatDate();
  const { postId, title, thumbnailImageUrl, createdAt } = cardItemData;

  return (
    <Link
      href={`/list/${postId}`}
      className="relative rounded-2xl shadow-[0px_1px_1px_rgba(0,0,0,0.08)]"
    >
      <div className="h-[142px] w-[136px] rounded-2xl bg-fill-neutralInversed-normal-pressed">
        {/* pb는 하단 캡션 오버레이가 덮는 높이. fallback 아이콘을 보이는 사진 영역 중앙에 둔다. */}
        <div className="relative h-full w-full pb-[44px] flex-center">
          {thumbnailImageUrl ? (
            <Image
              src={thumbnailImageUrl}
              alt={t("altText", { title })}
              fill
              className="rounded-2xl object-cover"
            />
          ) : (
            <Icon name="LogoCharacter" size={65} />
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 flex w-full flex-col gap-1.5 rounded-b-2xl bg-white px-3 py-[6px]">
        <span className="truncate text-caption1-semibold text-layout-header-default">{title}</span>
        <div className="flex items-center gap-1">
          <Icon name="PlaceCalendar" size={12} />
          <time dateTime={createdAt} className="text-caption2-regular text-layout-body-default">
            {formatDate(createdAt)}
          </time>
        </div>
      </div>
    </Link>
  );
};

interface MainCardListProps {
  isLoading: boolean;
  cardListData: CardListData[] | undefined;
}

const MainCardList = ({ isLoading = false, cardListData = [] }: MainCardListProps) => {
  const { ref: scrollRef, onMouseDown } = useHorizontalDragScroll();

  return (
    <div ref={scrollRef} onMouseDown={onMouseDown} className="-mx-5 flex gap-4 px-5 no-scrollbar">
      {isLoading ? (
        <RecentFoundItemSkeleton />
      ) : (
        cardListData.map((item) => <MainCardItem key={item.postId} cardItemData={item} />)
      )}
    </div>
  );
};

export default MainCardList;
