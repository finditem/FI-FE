"use client";

import { useSearchParams } from "next/navigation";
import { useSearchLocation } from "@/api/fetch/mapController";
import { PostListItem } from "@/components";
import MainSearchEmpty from "../MainSearchEmpty/MainSearchEmpty";
import HomeFilterSection from "../HomeFilterSection/HomeFilterSection";
import SearchLoading from "../SearchLoading/SearchLoading";
import { useInfiniteScroll, useVWorldAddressSearch } from "@/hooks";

const PostSheetContent = () => {
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("search")?.trim() ?? "";

  const {
    data: addressResults = [],
    isLoading: isCoordinatePending,
    isError: isCoordinateError,
  } = useVWorldAddressSearch(searchKeyword);

  const firstAddress = addressResults[0];
  const latitude = Number(firstAddress?.point?.y ?? NaN);
  const longitude = Number(firstAddress?.point?.x ?? NaN);
  const hasValidCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);

  const {
    data: posts = [],
    isPending: isPostPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLocation({
    latitude,
    longitude,
  });

  const { ref: loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (searchKeyword.length < 2) return <MainSearchEmpty />;
  if (isCoordinatePending || (hasValidCoordinates && isPostPending)) return <SearchLoading />;
  if (isCoordinateError || !hasValidCoordinates) return <MainSearchEmpty />;

  return (
    <>
      <HomeFilterSection />
      <ul className="-mx-5 mt-2 space-y-2">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} keyword={searchKeyword} />
        ))}
      </ul>
      {posts.length === 0 && <MainSearchEmpty />}
      {hasNextPage && <div ref={loadMoreRef} className="h-10 shrink-0" aria-hidden />}
    </>
  );
};

export default PostSheetContent;
