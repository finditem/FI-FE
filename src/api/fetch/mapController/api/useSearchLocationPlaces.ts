"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { PlaceType, SearchLocationPlacesResponse } from "../types/SearchLocationPlacesType";
import { useMainKakaoMapStore } from "@/store";
import { debounce } from "es-toolkit/compat";
import { useEffect, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";

/** 장소 필터 API(`/main/places/search-location`)가 허용하는 지도 레벨 상한. */
const MAX_PLACE_SEARCH_LEVEL = 8;

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
