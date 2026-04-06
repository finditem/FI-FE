"use client";

import { useEffect } from "react";
import { useGetMarketingPosts } from "@/api/fetch/admin";
import { PostListItem } from "@/components/domain";
import { EmptyState, LoadingState } from "@/components/state";
import { useInfiniteScroll } from "@/hooks";
import { useFilterParams } from "@/hooks/domain";
import { useToast } from "@/context/ToastContext";
import { ContentAgreeFilter } from "../_internal";

const ContentAgreeView = () => {
  const { addToast } = useToast();
  const { sort, category, findStatus, startDate, endDate } = useFilterParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useGetMarketingPosts({
      sort: sort || "LATEST",
      category,
      postStatus: findStatus,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

  useEffect(() => {
    if (isError) {
      addToast("게시글을 불러오지 못했어요", "error");
    }
  }, [isError]);

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <>
      <ContentAgreeFilter />

      <section className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : (
          <ul>
            {(data || []).map((post) => (
              <PostListItem post={post} linkState="list" key={post.id} />
            ))}
            {hasNextPage && <div ref={ref} className="h-10" />}
          </ul>
        )}
        {!isLoading && (!data || data.length === 0) && (
          <EmptyState
            icon={{
              iconName: "LogoCharacterOutlined",
              iconSize: 130,
              iconColor: "text-labelsVibrant-secondary",
            }}
            description="아직 게시글이 없어요."
          />
        )}
      </section>
    </>
  );
};

export default ContentAgreeView;
