"use client";

import { useGetPosts } from "@/api/fetch/post";
import { FilterSection, Tab } from "@/components/domain";
import { TABS } from "../../_constants/TABS";
import { ItemStatus } from "@/types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";
import { useFilterParams } from "@/hooks/domain";
import { DefaultList } from "../_internal";
import { ErrorBoundary } from "@/app/ErrorBoundary";

type PostType = "LOST" | "FOUND";

interface DefaultListProps {
  searchUpdateQuery: (key: string, value?: string) => void;
}

const DefaultListSection = ({ searchUpdateQuery }: DefaultListProps) => {
  const { type, region, category, sort, findStatus } = useFilterParams();
  const normalizedType = type?.toLowerCase();
  const selectedType = (normalizedType ?? "lost") as "lost" | "found";
  const postType: PostType = selectedType === "found" ? "FOUND" : "LOST";

  const postStatus: ItemStatus | undefined =
    findStatus && findStatus.trim() !== "" ? (findStatus as ItemStatus) : undefined;

  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts({
    address: region ?? "",
    postType,
    postStatus,
    category,
    sortType: sort ?? "LATEST",
  });
  const { ref: listRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <section className="h-hf-base">
      <Tab
        tabs={TABS}
        className="sticky top-[56px] z-10 bg-white"
        selected={selectedType}
        onValueChange={(key) => searchUpdateQuery("type", key)}
      />

      <FilterSection />

      <ErrorBoundary toastMessage="목록을 불러올 수 없어요. 다시 시도해 주세요.">
        <DefaultList listData={listData} listRef={listRef} hasNextPage={hasNextPage} />
      </ErrorBoundary>
    </section>
  );
};

export default DefaultListSection;
