"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetMarkerResponse } from "../types/GetMarkerType";
import { NearbyPostFilter } from "../types/NearbyPostType";

const useNearbyPostMarkers = (placeId: number | null, { postType, category }: NearbyPostFilter) => {
  const params = new URLSearchParams();
  if (postType) params.set("postType", postType);
  if (category) params.set("category", category);
  const queryString = params.toString();

  return useAppQuery<GetMarkerResponse>(
    "public",
    ["nearby-post-markers", placeId, postType ?? "", category ?? ""],
    `/main/places/${placeId}/nearby-post-markers${queryString ? `?${queryString}` : ""}`,
    { enabled: placeId !== null }
  );
};

export default useNearbyPostMarkers;
