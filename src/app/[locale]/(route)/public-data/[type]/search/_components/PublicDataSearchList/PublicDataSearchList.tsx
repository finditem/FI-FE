"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { PublicDataItemCard } from "../../../../_components/_internal";
import { EmptyState, LoadingState } from "@/components";
import { useInfiniteScroll } from "@/hooks";
import { PublicDataItem, PublicDataResponse } from "@/types";
import { useToast } from "@/context/ToastContext";
import { usePublicDataListQuery } from "../../../../_hooks/usePublicDataListQuery/usePublicDataListQuery";

const PublicDataSearchList = () => {
  const t = useTranslations("PublicDataSearchList");
  const { addToast } = useToast();
  const hasErrorToastShown = useRef(false);

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
      if (!hasErrorToastShown.current) {
        addToast(t("loadFailedToast"), "error");
        hasErrorToastShown.current = true;
      }
    } else {
      hasErrorToastShown.current = false;
    }
  }, [isError, addToast, t]);

  if (isLoading) return <LoadingState />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={{
          iconName: "NoPublicDataSearch",
          iconSize: 70,
        }}
        title={t("noResultsTitle")}
      />
    );
  }

  return (
    <section>
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

export default PublicDataSearchList;
