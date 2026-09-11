"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { NeighborhoodPlace, NeighborhoodPlaceFilter } from "../../_types/NeighborhoodPlace";

/**
 * 홈 동네 구경 목록을 가져옵니다. `GET /places`는 노출 가능한 최신 장소를 최대 5개 반환하며,
 * `ALL`이면 카테고리 없이 전체를 조회합니다.
 */
const useNeighborhoodPlaces = (filter: NeighborhoodPlaceFilter) => {
  const query = filter === "ALL" ? "" : `?type=${filter}`;

  const { data } = useAppQuery<ApiBaseResponseType<NeighborhoodPlace[]>>(
    "public",
    ["neighborhood-places", filter],
    `/places${query}`,
    { staleTime: 1000 * 60, suspense: true }
  );

  return { data: data?.result ?? [] };
};

export default useNeighborhoodPlaces;
