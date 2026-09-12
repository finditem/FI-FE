"use client";

import { useTranslations } from "next-intl";
import { PostListItem } from "@/components";
import { useSearchLocation } from "@/api/fetch/mapController";
import { useInfiniteScroll } from "@/hooks";
import { useMainKakaoMapStore } from "@/store";
import HomeFilterSection from "../HomeFilterSection/HomeFilterSection";
import PostFeedSkeleton from "./_internal/PostFeedSkeleton/PostFeedSkeleton";

const MESSAGE_STYLE = "py-10 text-center text-body2-medium text-layout-body-default";

/**
 * 검색바 아래 분실물/발견물 칩을 눌렀을 때 바텀시트에 표시되는 게시글 피드입니다.
 *
 * @remarks
 * 상단 필터는 `HomeFilterSection`을 그대로 재사용하며, 상단 칩과 동일한 `?post-type` / `?category`
 * 쿼리를 공유합니다. 목록은 지도 중심 기준 `useSearchLocation`(`/main/posts/search-location`)으로,
 * 검색 시트(`PostSheetContent`)와 같은 훅을 씁니다.
 */
const PostTypeSheetContent = () => {
  const t = useTranslations("PostTypeSheet");
  const { lat, lng } = useMainKakaoMapStore((s) => s.latLng);

  const {
    data: posts = [],
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLocation({ latitude: lat, longitude: lng });

  const { ref: loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <>
      <HomeFilterSection />

      {isError ? (
        <p className={MESSAGE_STYLE}>{t("loadError")}</p>
      ) : isPending ? (
        <ul className="-mx-5 mt-2">
          <PostFeedSkeleton />
        </ul>
      ) : posts.length === 0 ? (
        <p className={MESSAGE_STYLE}>{t("empty")}</p>
      ) : (
        <>
          <ul className="-mx-5 mt-2">
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </ul>
          {hasNextPage && <div ref={loadMoreRef} className="h-10 shrink-0" aria-hidden />}
        </>
      )}
    </>
  );
};

export default PostTypeSheetContent;
