"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PostItem } from "@/api/fetch/post";
import { CATEGORY, POST_TYPE } from "../../_components/HOME_CONST";
import { MOCK_HOME_FEED_POSTS } from "./homeFeedPosts.mock";

/**
 * 분실물/발견물 칩으로 연 게시글 피드를 가져옵니다. `?post-type`(lost/find)과 `?category`로 필터링합니다.
 *
 * @remarks
 * 백엔드 API가 아직 없어 목업 데이터를 반환합니다. 실제 연동 시 queryFn을 axios 호출로 교체하고
 * 목업 파일을 제거한다.
 */
const usePostTypeFeed = () => {
  const searchParams = useSearchParams();
  const postType = searchParams.get(POST_TYPE)?.toLowerCase() ?? null;
  const category = searchParams.get(CATEGORY)?.toUpperCase() ?? null;

  // "모두보기"로 post-type이 없으면 분실물/발견물을 모두 보여준다.
  const typeFilter = postType === "lost" ? "LOST" : postType === "find" ? "FOUND" : null;

  return useQuery<PostItem[]>({
    queryKey: ["home-feed-posts", typeFilter, category],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return MOCK_HOME_FEED_POSTS.filter(
        (post) =>
          (typeFilter === null || post.postType === typeFilter) &&
          (category === null || post.category === category)
      );
    },
    staleTime: 1000 * 60,
  });
};

export default usePostTypeFeed;
