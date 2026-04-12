"use client";

import { useGetUsersMePosts } from "@/api/fetch/user";
import { useFilterParams } from "@/hooks/domain";
import {
  FindStatusFilterValue,
  StatusFilterValue,
} from "@/components/domain/FilterSectionBottomSheet/_types/types";
import { LoadingState } from "@/components/state";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { MypageEmptyUI, PostListItem } from "@/components/domain";
import { useSearchParams } from "next/navigation";

const MypagePostsContent = () => {
  const { status, findStatus, category, sort, startDate, endDate } = useFilterParams();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const keyword = searchParams.get("keyword") ?? undefined;

  const {
    data: postsData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUsersMePosts({
    postType: status as StatusFilterValue,
    postStatus: findStatus as FindStatusFilterValue,
    category,
    startDate,
    endDate,
    keyword,
    sortType: sort ?? "LATEST",
  });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) return <LoadingState />;
  if (isError) addToast("목록을 불러오는데 실패했어요", "error");

  return (
    <section>
      <h2 className="sr-only">게시글 목록 영역</h2>
      {postsData && postsData.length === 0 ? (
        <MypageEmptyUI pageType="posts" />
      ) : (
        <>
          <ul>
            {postsData &&
              postsData.map((item, index) => (
                <PostListItem key={index} post={item} keyword={keyword} />
              ))}
          </ul>

          <div ref={ref} className="h-10" />
        </>
      )}
    </section>
  );
};

export default MypagePostsContent;
