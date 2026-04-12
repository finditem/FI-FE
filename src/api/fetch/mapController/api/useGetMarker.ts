import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetMarkerResponse } from "../types/GetMarkerType";
import { useMainKakaoMapStore } from "@/store";
import { keepPreviousData } from "@tanstack/react-query";
import { isMapZoomFetchDisabled } from "./isMapZoomFetchDisabled";

export const isMarkerFetchDisabledByZoom = (mapLevel: number): boolean => {
  return isMapZoomFetchDisabled(mapLevel);
};

const useGetMarker = () => {
  const { latLng, mapLevel } = useMainKakaoMapStore();
  const level = Math.min(mapLevel, 11);
  const { lat: latitude, lng: longitude } = latLng;

  const isMarkerFetchDisabled = isMarkerFetchDisabledByZoom(mapLevel);

  return useAppQuery<GetMarkerResponse>(
    "public",
    ["marker", latitude, longitude, level],
    `/main/posts/marker?latitude=${latitude}&longitude=${longitude}&level=${level}`,
    {
      placeholderData: keepPreviousData,
      enabled: !isMarkerFetchDisabled,
    }
  );
};

export default useGetMarker;
