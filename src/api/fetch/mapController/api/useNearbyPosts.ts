"use client";

import useAxios from "@/api/_base/axios/useAxios";
import useAppCompositeInfiniteQuery from "@/api/_base/query/useAppCompositeInfiniteQuery";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import type { PostItem } from "@/api/fetch/post";
import { NearbyPostFilter, NearbyPostResponse } from "../types/NearbyPostType";

export type NearbyPostPageParam = undefined | { lastDistance: number; lastPostId: number };

const useNearbyPosts = (placeId: number | null, { postType, category }: NearbyPostFilter) => {
  const axios = useAxios("public");

  const buildQueryString = (pageParam: NearbyPostPageParam) => {
    const params = new URLSearchParams();
    if (postType) params.set("postType", postType);
    if (category) params.set("category", category);
    if (pageParam) {
      params.set("lastDistance", String(pageParam.lastDistance));
      params.set("lastPostId", String(pageParam.lastPostId));
    }
    return params.toString();
  };

  // PostListItem이 쓰는 PostItem은 식별자가 `id`라 `postId`만 맞춰 넘긴다.
  // 나머지 필드는 이름과 의미가 같아 추가 매핑이 필요 없다.
  return useAppCompositeInfiniteQuery<NearbyPostResponse, unknown, PostItem[], NearbyPostPageParam>(
    ["nearby-posts", placeId, postType ?? "", category ?? ""],
    {
      enabled: placeId !== null,
      placeholderData: keepPreviousData,
      initialPageParam: undefined,
      queryFn: async ({ pageParam }) => {
        const queryString = buildQueryString(pageParam);
        const { data } = await axios.get<NearbyPostResponse>(
          `/main/places/${placeId}/nearby-posts${queryString ? `?${queryString}` : ""}`
        );
        return data;
      },
      getNextPageParam: (lastPage) => {
        const result = lastPage.result;
        if (result?.hasNext && result.nextDistance != null && result.nextPostId != null) {
          return { lastDistance: result.nextDistance, lastPostId: result.nextPostId };
        }
        return undefined;
      },
      select: (data: InfiniteData<NearbyPostResponse>) =>
        data.pages.flatMap((page) =>
          (page.result?.posts ?? []).map(
            ({ postId, ...rest }) => ({ id: postId, ...rest }) as PostItem
          )
        ),
    }
  );
};

export default useNearbyPosts;
