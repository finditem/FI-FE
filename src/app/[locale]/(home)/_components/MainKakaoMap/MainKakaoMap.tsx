"use client";

import { BaseKakaoMap } from "@/components";
import useMainKakaoMap from "../../_hooks/useMainKakaoMap/useMainKakaoMap";
import {
  useGetMarker,
  isMarkerFetchDisabledByZoom,
  useSearchLocationPlaces,
} from "@/api/fetch/mapController";
import type { PlaceType } from "@/api/fetch/mapController";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MARKER_ID,
  PLACE_FILTER_PARAM,
  PLACE_FILTER_TO_CATEGORY,
  PLACE_FILTER_VALUES,
} from "../HOME_CONST";
import type { PlaceFilterValue } from "../HOME_CONST";
import { useMainKakaoMapStore } from "@/store";
import { MOCK_PLACE_MARKERS } from "./placeMarkers.mock";

const MainKakaoMap = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const triggerLevelReset = useMainKakaoMapStore((s) => s.triggerLevelReset);
  const triggerMarkerSheetSnap = useMainKakaoMapStore((s) => s.triggerMarkerSheetSnap);
  const { mapCenter, mapLevel, setMapLevel, setLatLng } = useMainKakaoMap();

  const placeParam = searchParams.get(PLACE_FILTER_PARAM);
  const placeType: PlaceType | null =
    placeParam && (PLACE_FILTER_VALUES as readonly string[]).includes(placeParam)
      ? PLACE_FILTER_TO_CATEGORY[placeParam as PlaceFilterValue]
      : null;
  const isPlaceMode = placeType !== null;

  const { data: markerData } = useGetMarker();
  const { data: placesData } = useSearchLocationPlaces(placeType);
  const showPostMarkers = !isPlaceMode && !isMarkerFetchDisabledByZoom(mapLevel);

  // ponytail: 백엔드 장소 데이터가 아직 비어 있어 dev에서만 목업으로 대체. 데이터 들어오면 이 줄 삭제.
  const placeMarkers = placesData?.result?.placeMarkers ?? [];
  const resolvedPlaceMarkers =
    process.env.NODE_ENV !== "production" && placeType && placeMarkers.length === 0
      ? MOCK_PLACE_MARKERS.filter((marker) => marker.type === placeType)
      : placeMarkers;

  const handleMarkerClick = (postId: number, position: { lat: number; lng: number }) => {
    triggerLevelReset();
    setLatLng(position);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set(MARKER_ID, String(postId));
    router.push(`/?${params.toString()}`, { scroll: false });
    triggerMarkerSheetSnap();
  };

  return (
    <BaseKakaoMap
      center={mapCenter}
      level={mapLevel}
      draggable
      onLevelChange={(nextLevel) => setMapLevel(nextLevel)}
      onDragEnd={(nextCenter) => setLatLng(nextCenter)}
      markerData={showPostMarkers ? markerData?.result : undefined}
      placeMarkerData={isPlaceMode ? resolvedPlaceMarkers : undefined}
      onMarkerClick={handleMarkerClick}
    />
  );
};

export default MainKakaoMap;
