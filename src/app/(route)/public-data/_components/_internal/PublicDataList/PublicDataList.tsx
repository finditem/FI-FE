"use client";

import { useEffect, useMemo } from "react";
import { EmptyState, LoadingState } from "@/components";
import { useInfiniteScroll } from "@/hooks";
import { PublicDataItem, PublicDataResponse } from "@/types";
import { useToast } from "@/context/ToastContext";
import { usePublicDataListQuery } from "../../../_hooks/usePublicDataListQuery/usePublicDataListQuery";
import PublicDataItemCard from "../PublicDataItemCard/PublicDataItemCard";

const PublicDataList = () => {
  const { addToast } = useToast();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePublicDataListQuery();

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const items = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: PublicDataResponse) => {
      const itemData = page?.items?.item || [];
      return Array.isArray(itemData) ? itemData : [itemData];
    }) as PublicDataItem[];
  }, [data?.pages]);

  useEffect(() => {
    if (isError) {
      addToast("데이터를 불러오지 못했어요.", "error");
    }
  }, [isError, addToast]);

  if (isLoading) return <LoadingState />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={{
          iconName: "NoPosts",
          iconSize: 70,
        }}
        title="조회된 데이터가 없습니다."
      />
    );
  }

  return (
    <section aria-label="목록">
      <ul>
        {items.map((item, index) => (
          <PublicDataItemCard key={`${item.atcId}-${index}`} item={item} />
        ))}
      </ul>
      {hasNextPage && <div ref={ref} className="h-10 w-full" />}
      {isFetchingNextPage && <LoadingState />}
    </section>
  );
};

export default PublicDataList;
