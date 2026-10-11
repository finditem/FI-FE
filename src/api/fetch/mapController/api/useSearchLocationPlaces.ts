"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { PlaceType, SearchLocationPlacesResponse } from "../types/SearchLocationPlacesType";
import { useMainNaverMapStore } from "@/store";
import { getServerMapLevel } from "@/utils";
import { debounce } from "es-toolkit/compat";
import { useEffect, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";

const useSearchLocationPlaces = (type: PlaceType | null) => {
  const { latLng, mapZoom } = useMainNaverMapStore();
  const level = getServerMapLevel(mapZoom);
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
