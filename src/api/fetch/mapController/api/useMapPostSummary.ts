"use client";

import useAxios from "@/api/_base/axios/useAxios";
import useAppCompositeInfiniteQuery from "@/api/_base/query/useAppCompositeInfiniteQuery";
import { useMainKakaoMapStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { POST_TYPE } from "@/app/(home)/_components/HOME_CONST";
import { MapPostSummaryPostItem, MapPostSummaryResponse } from "../types/MapPostSummaryType";
import { PostType } from "@/types";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";

export const mapPostTypeQueryToApiParam = (value: string | null): PostType | undefined => {
  const v = value?.trim().toLowerCase();
  if (v === "lost") return "LOST";
  if (v === "find") return "FOUND";
  return undefined;
};

const MAP_SUMMARY_PAGE_SIZE = 10;

export type MapPostSummaryPageParam =
  | undefined
  | {
      lastDistance: number;
      lastPostId: number;
    };

const useMapPostSummary = (postId: number) => {
  const axios = useAxios("public");
  const { mapLevel } = useMainKakaoMapStore();
  const level = Math.min(mapLevel, 11);
  const searchParams = useSearchParams();
  const apiPostType = mapPostTypeQueryToApiParam(searchParams.get(POST_TYPE));
  const postStatus = searchParams.get("postStatus");
  const category = searchParams.get("category");
  const apiCategory = category?.toUpperCase();
  const keyword = searchParams.get("keyword");

  const queryKey = [
    "map-post-summary",
    postId,
    level,
    apiPostType ?? "all",
    postStatus ?? "",
    apiCategory ?? "",
    keyword ?? "",
  ] as const;

  const buildQueryString = (pageParam: MapPostSummaryPageParam) => {
    const params = new URLSearchParams();
    params.set("level", String(level));
    params.set("size", String(MAP_SUMMARY_PAGE_SIZE));
    if (apiPostType) {
      params.set("postType", apiPostType);
    }
    if (postStatus) {
      params.set("postStatus", postStatus);
    }
    if (apiCategory) {
      params.set("category", apiCategory);
    }
    if (keyword) {
      params.set("keyword", keyword);
    }
    if (pageParam) {
      params.set("lastDistance", String(pageParam.lastDistance));
      params.set("lastPostId", String(pageParam.lastPostId));
    }
    return params.toString();
  };

  return useAppCompositeInfiniteQuery<
    MapPostSummaryResponse,
    unknown,
    MapPostSummaryPostItem[],
    MapPostSummaryPageParam
  >(queryKey, {
    enabled: !!postId,
    placeholderData: keepPreviousData,
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const qs = buildQueryString(pageParam);
      const { data } = await axios.get<MapPostSummaryResponse>(
        `/main/posts/${postId}/summary?${qs}`
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      const r = lastPage.result;
      if (r?.hasNext && r.nextDistance != null && r.nextPostId != null) {
        return { lastDistance: r.nextDistance, lastPostId: r.nextPostId };
      }
      return undefined;
    },
    select: (data: InfiniteData<MapPostSummaryResponse>) =>
      data.pages.flatMap((page) => page.result?.posts ?? []),
  });
};

export default useMapPostSummary;
