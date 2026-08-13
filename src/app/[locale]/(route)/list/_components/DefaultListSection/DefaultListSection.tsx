"use client";

import { useTranslations } from "next-intl";
import { useGetPosts } from "@/api/fetch/post";
import { FilterSection, Tab } from "@/components";
import { ItemStatus } from "@/types";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";
import { useFilterParams } from "@/hooks";
import { DefaultList } from "../_internal";
import useTabs from "../../_hooks/useTabs/useTabs";

type PostType = "LOST" | "FOUND";

interface DefaultListProps {
  searchUpdateQuery: (key: string, value?: string) => void;
}

const DefaultListSection = ({ searchUpdateQuery }: DefaultListProps) => {
  const t = useTranslations("DefaultListSection");
  const tabs = useTabs();
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
        tabs={tabs}
        className="sticky top-[56px] z-10 bg-white"
        selected={selectedType}
        onValueChange={(key) => searchUpdateQuery("type", key)}
      />

      <FilterSection />

      <ErrorBoundary toastMessage={t("errorToast")}>
        <DefaultList listData={listData} listRef={listRef} hasNextPage={hasNextPage} />
      </ErrorBoundary>
    </section>
  );
};

export default DefaultListSection;
