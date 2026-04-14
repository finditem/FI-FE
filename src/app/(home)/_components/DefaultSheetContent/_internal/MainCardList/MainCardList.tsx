"use client";

import { Chip, Icon } from "@/components/common";
import { useHorizontalDragScroll } from "@/hooks";
import Link from "next/link";
import PublicMoreViewCard from "./PublicMoreViewCard";
import Image from "next/image";
import RecentFoundItemSkeleton from "../RecentFoundItemSection/RecentFoundItemSkeleton";
import { formatDate } from "@/utils";

interface CardListData {
  postId: string;
  title: string;
  thumbnailImageUrl: string;
  createdAt: string;
}

interface MainCardItemProps {
  showChip: boolean;
  cardItemData: CardListData;
  mode: "recent" | "public";
}

const MainCardItem = ({ showChip, cardItemData, mode }: MainCardItemProps) => {
  const { postId, title, thumbnailImageUrl, createdAt } = cardItemData;

  const href = mode === "public" ? `/public-data/found/${postId}` : `/list/${postId}`;

  return (
    <Link href={href} className="relative rounded-2xl border-[0.7px] border-divider-default">
      <div className="bg-fill-neutralInversed-normal-pressed h-[120px] w-[123px] rounded-2xl">
        <div className="relative flex h-full w-full justify-center">
          {thumbnailImageUrl ? (
            <Image
              src={thumbnailImageUrl}
              alt={`최근 발견된 분실물 ${title} 이미지`}
              fill
              className="rounded-2xl object-cover"
            />
          ) : (
            <Icon name="LogoCharacter" size={65} />
          )}
          {showChip && (
            <div className="absolute left-2 top-2">
              <Chip label="경찰청" className="!px-2" />
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 flex w-full flex-col gap-1 rounded-b-2xl bg-white px-3 py-[6px]">
        <span className="truncate text-caption1-semibold text-layout-header-default">{title}</span>
        <time dateTime={createdAt} className="text-caption2-regular text-layout-body-default">
          {formatDate(createdAt)}
        </time>
      </div>
    </Link>
  );
};

interface MainCardListProps {
  mode?: "recent" | "public";
  isLoading: boolean;
  cardListData: CardListData[] | undefined;
}

const MainCardList = ({
  mode = "recent",
  isLoading = false,
  cardListData = [],
}: MainCardListProps) => {
  const { ref: scrollRef, onMouseDown } = useHorizontalDragScroll();

  const isPublicMode = mode === "public";

  return (
    <div ref={scrollRef} onMouseDown={onMouseDown} className="-mx-5 flex gap-4 px-5 no-scrollbar">
      {isLoading ? (
        <RecentFoundItemSkeleton />
      ) : (
        cardListData.map((item) => (
          <MainCardItem key={item.postId} showChip={isPublicMode} cardItemData={item} mode={mode} />
        ))
      )}
      {isPublicMode && <PublicMoreViewCard />}
    </div>
  );
};

export default MainCardList;
