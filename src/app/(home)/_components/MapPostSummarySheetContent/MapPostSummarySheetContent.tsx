"use client";

import { PostListItem } from "@/components";
import { useSearchParams } from "next/navigation";
import { useMapPostSummary } from "@/api/fetch/mapController";
import { MARKER_ID } from "../../_constants/QUERY_PARAMS";
import SearchLoading from "../SearchLoading/SearchLoading";
import MainSearchEmpty from "../MainSearchEmpty/MainSearchEmpty";
import HomeFilterSection from "../HomeFilterSection/HomeFilterSection";
import { useInfiniteScroll } from "@/hooks";

const MapPostSummarySheetContent = () => {
  const searchParams = useSearchParams();
  const raw = searchParams.get(MARKER_ID);
  const postId = raw ? Number(raw) : NaN;
  const isValidPostId = Number.isFinite(postId) && postId > 0;

  const {
    data: posts = [],
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMapPostSummary(isValidPostId ? postId : 0);

  const { ref: loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (!isValidPostId) return null;

  if (isPending) return <SearchLoading />;

  return (
    <>
      <HomeFilterSection />
      {posts.length === 0 && <MainSearchEmpty />}
      <ul className="-mx-5 mt-2 space-y-2">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </ul>
      {hasNextPage && <div ref={loadMoreRef} className="h-10 shrink-0" aria-hidden />}
    </>
  );
};

export default MapPostSummarySheetContent;
