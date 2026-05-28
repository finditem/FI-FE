"use client";

import useAxios from "@/api/_base/axios/useAxios";
import useAppCompositeInfiniteQuery from "@/api/_base/query/useAppCompositeInfiniteQuery";
import { POST_TYPE } from "@/app/(home)/_components/HOME_CONST";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { MapPostSummaryPageParam, mapPostTypeQueryToApiParam } from "./useMapPostSummary";
import { MapPostSummaryPostItem, MapPostSummaryResponse } from "../types/MapPostSummaryType";
import { useMainKakaoMapStore } from "@/store";

const SEARCH_LOCATION_PAGE_SIZE = 10;

interface UseSearchLocationParams {
  latitude: number;
  longitude: number;
}

const useSearchLocation = ({ latitude, longitude }: UseSearchLocationParams) => {
  const { mapLevel } = useMainKakaoMapStore();
  const level = Math.min(mapLevel, 11);
  const axios = useAxios("public");
  const searchParams = useSearchParams();
  const apiPostType = mapPostTypeQueryToApiParam(searchParams.get(POST_TYPE));
  const postStatus = searchParams.get("postStatus");
  const category = searchParams.get("category");
  const apiCategory = category?.toUpperCase();

  const queryKey = [
    "search-location-posts",
    latitude,
    longitude,
    level,
    apiPostType ?? "all",
    postStatus ?? "",
    apiCategory ?? "",
  ] as const;

  const buildQueryString = (pageParam: MapPostSummaryPageParam) => {
    const params = new URLSearchParams();
    params.set("latitude", String(latitude));
    params.set("longitude", String(longitude));
    params.set("level", String(level));
    params.set("size", String(SEARCH_LOCATION_PAGE_SIZE));

    if (apiPostType) {
      params.set("postType", apiPostType);
    }
    if (postStatus) {
      params.set("postStatus", postStatus);
    }
    if (apiCategory) {
      params.set("category", apiCategory);
    }
    if (pageParam) {
      params.set("lastDistance", String(pageParam.lastDistance));
      params.set("lastPostId", String(pageParam.lastPostId));
    }
    return params.toString();
  };

  const isValidCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);

  return useAppCompositeInfiniteQuery<
    MapPostSummaryResponse,
    unknown,
    MapPostSummaryPostItem[],
    MapPostSummaryPageParam
  >(queryKey, {
    enabled: isValidCoordinates && level > 0,
    placeholderData: keepPreviousData,
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const qs = buildQueryString(pageParam);
      const { data } = await axios.get<MapPostSummaryResponse>(`/main/posts/search-location?${qs}`);
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

export default useSearchLocation;
