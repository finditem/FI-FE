"use client";

import useAppQuery from "@/api/_base/query/useAppQuery";
import { RecentFoundResponse } from "../types/RecentFoundType";
import { useMainKakaoMapStore } from "@/store";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { isMapZoomFetchDisabled } from "./isMapZoomFetchDisabled";

const useRecentFound = () => {
  const { latLng, mapLevel } = useMainKakaoMapStore();
  const level = Math.min(mapLevel, 11);
  const { lat, lng } = latLng;
  const isRecentFoundFetchDisabled = isMapZoomFetchDisabled(mapLevel);

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
