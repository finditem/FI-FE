"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { PlaceType, SearchLocationPlacesResponse } from "../types/SearchLocationPlacesType";
import { useMainKakaoMapStore } from "@/store";
import { debounce } from "es-toolkit/compat";
import { useEffect, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";

/** 장소 필터 API(`/main/places/search-location`)가 허용하는 지도 레벨 상한. */
const MAX_PLACE_SEARCH_LEVEL = 8;

/**
 * 헤더 장소 칩으로 선택한 카테고리의 지도 장소 마커/목록을 조회합니다.
 *
 * @param type - 선택된 카테고리. `null`이면 요청을 보내지 않습니다.
 * @remarks 지도 조작이 끝난 뒤 좌표를 500ms 디바운스합니다({@link useRecentFound}와 동일).
 */
const useSearchLocationPlaces = (type: PlaceType | null) => {
  const { latLng, mapLevel } = useMainKakaoMapStore();
  const level = Math.min(mapLevel, MAX_PLACE_SEARCH_LEVEL);
  const { lat, lng } = latLng;

  const [debouncedLatLng, setDebouncedLatLng] = useState(latLng);

  const debouncedUpdateRef = useRef<
    ((next: { lat: number; lng: number }) => void) & { cancel: () => void }
  >(
    debounce((next: { lat: number; lng: number }) => {
      setDebouncedLatLng(next);
    }, 500)
  );

  useEffect(() => {
    debouncedUpdateRef.current({ lat, lng });
    return () => {
      debouncedUpdateRef.current.cancel();
    };
  }, [lat, lng]);

  const { lat: latitude, lng: longitude } = debouncedLatLng;

  return useAppQuery<SearchLocationPlacesResponse>(
    "public",
    ["search-location-places", type, level, latitude, longitude],
    `/main/places/search-location?latitude=${latitude}&longitude=${longitude}&level=${level}&type=${type}`,
    {
      placeholderData: keepPreviousData,
      enabled: type !== null,
    }
  );
};

export default useSearchLocationPlaces;
