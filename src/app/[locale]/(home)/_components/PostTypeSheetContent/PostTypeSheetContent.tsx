"use client";

import { useTranslations } from "next-intl";
import { PostListItem } from "@/components";
import HomeFilterSection from "../HomeFilterSection/HomeFilterSection";
import usePostTypeFeed from "../../_hooks/usePostTypeFeed/usePostTypeFeed";
import PostFeedSkeleton from "./_internal/PostFeedSkeleton/PostFeedSkeleton";

const MESSAGE_STYLE = "py-10 text-center text-body2-medium text-layout-body-default";

/**
 * 검색바 아래 분실물/발견물 칩을 눌렀을 때 바텀시트에 표시되는 게시글 피드입니다.
 *
 * @remarks
 * 상단 필터는 `HomeFilterSection`을 그대로 재사용하며, 상단 칩과 동일한 `?post-type` / `?category`
 * 쿼리를 공유합니다. 데이터는 아직 목업입니다({@link usePostTypeFeed}).
 */
const PostTypeSheetContent = () => {
  const t = useTranslations("PostTypeSheet");
  const { data, isLoading, isError } = usePostTypeFeed();
  const posts = data ?? [];

  return (
    <>
      <HomeFilterSection />

      {isError ? (
        <p className={MESSAGE_STYLE}>{t("loadError")}</p>
      ) : isLoading ? (
        <ul className="-mx-5 mt-2">
          <PostFeedSkeleton />
        </ul>
      ) : posts.length === 0 ? (
        <p className={MESSAGE_STYLE}>{t("empty")}</p>
      ) : (
        <ul className="-mx-5 mt-2">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </ul>
      )}
    </>
  );
};

export default PostTypeSheetContent;
