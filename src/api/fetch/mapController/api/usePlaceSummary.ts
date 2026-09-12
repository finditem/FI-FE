"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { PlaceSummary } from "../types/SearchLocationPlacesType";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

const usePlaceSummary = (placeId: number | null) => {
  return useAppQuery<ApiBaseResponseType<PlaceSummary>>(
    "public",
    ["place-summary", placeId],
    `/main/places/${placeId}/summary`,
    { enabled: placeId !== null }
  );
};

export default usePlaceSummary;
