"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { RecentFoundResponse } from "../types/RecentFoundType";
import { useMainNaverMapStore } from "@/store";
import { getServerMapLevel } from "@/utils";
import { debounce } from "es-toolkit/compat";
import { useEffect, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { isMapZoomFetchDisabled } from "./isMapZoomFetchDisabled";

const useRecentFound = () => {
  const { latLng, mapZoom } = useMainNaverMapStore();
  const level = getServerMapLevel(mapZoom);
  const { lat, lng } = latLng;
  const isRecentFoundFetchDisabled = isMapZoomFetchDisabled(mapZoom);

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

  const { lat: debouncedLatitude, lng: debouncedLongitude } = debouncedLatLng;

  return useAppQuery<RecentFoundResponse>(
    "public",
    ["recent-found", level, debouncedLatitude, debouncedLongitude],
    `/main/posts/recent-found?latitude=${debouncedLatitude}&longitude=${debouncedLongitude}&level=${level}`,
    {
      placeholderData: keepPreviousData,
      enabled: !isRecentFoundFetchDisabled,
    }
  );
};

export default useRecentFound;
