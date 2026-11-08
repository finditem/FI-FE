"use client";

import { useTranslations } from "next-intl";
import { PostListItem } from "@/components";
import { useNearbyPosts } from "@/api/fetch/mapController";
import type { NearbyPostFilter } from "@/api/fetch/mapController";
import PostFeedSkeleton from "../../../PostTypeSheetContent/_internal/PostFeedSkeleton/PostFeedSkeleton";

const MESSAGE_STYLE = "py-10 text-center text-body2-medium text-layout-body-default";

interface NearbyPostListProps {
  placeId: number;
  filter: NearbyPostFilter;
}

/** 선택한 장소 반경 500m의 게시글 목록. 커서 기반으로 10개씩 이어 붙인다. */
const NearbyPostList = ({ placeId, filter }: NearbyPostListProps) => {
  const t = useTranslations("PlaceDetailSheet");
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useNearbyPosts(placeId, filter);
  const posts = data ?? [];

  if (isError) return <p className={MESSAGE_STYLE}>{t("loadError")}</p>;

  if (isLoading) {
    return (
      <ul className="-mx-5 mt-2">
        <PostFeedSkeleton />
      </ul>
    );
  }

  if (posts.length === 0) return <p className={MESSAGE_STYLE}>{t("emptyPost")}</p>;

  return (
    <>
      <ul className="-mx-5 mt-2">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </ul>
      {hasNextPage && (
        <button
          type="button"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="flex w-full items-center justify-center py-3 text-body1-medium text-labelsVibrant-primary disabled:opacity-50"
        >
          {t("moreButton")}
        </button>
      )}
    </>
  );
};

export default NearbyPostList;
