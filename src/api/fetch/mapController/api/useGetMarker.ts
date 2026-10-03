import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetMarkerResponse } from "../types/GetMarkerType";
import { useMainNaverMapStore } from "@/store";
import { getServerMapLevel } from "@/utils";
import { keepPreviousData } from "@tanstack/react-query";
import { isMapZoomFetchDisabled } from "./isMapZoomFetchDisabled";

export const isMarkerFetchDisabledByZoom = (mapZoom: number): boolean => {
  return isMapZoomFetchDisabled(mapZoom);
};

const useGetMarker = () => {
  const { latLng, mapZoom } = useMainNaverMapStore();
  const level = getServerMapLevel(mapZoom);
  const { lat: latitude, lng: longitude } = latLng;

  const isMarkerFetchDisabled = isMarkerFetchDisabledByZoom(mapZoom);

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
