"use client";

import { BaseKakaoMap } from "@/components";
import useMainKakaoMap from "../../_hooks/useMainKakaoMap/useMainKakaoMap";
import {
  useGetMarker,
  isMarkerFetchDisabledByZoom,
  useSearchLocationPlaces,
  useNearbyPostMarkers,
  usePlaceSummary,
} from "@/api/fetch/mapController";
import type { PlaceType } from "@/api/fetch/mapController";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MARKER_ID,
  PLACE_FILTER_PARAM,
  PLACE_FILTER_TO_CATEGORY,
  PLACE_FILTER_VALUES,
  PLACE_ID_PARAM,
  PLACE_RADIUS_M,
} from "../HOME_CONST";
import type { PlaceFilterValue } from "../HOME_CONST";
import { useMainKakaoMapStore } from "@/store";

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

  const placeIdParam = Number(searchParams.get(PLACE_ID_PARAM));
  const selectedPlaceId = isPlaceMode && placeIdParam > 0 ? placeIdParam : null;

  const { data: markerData } = useGetMarker();
  const { data: placesData } = useSearchLocationPlaces(placeType);
  const { data: nearbyMarkerData } = useNearbyPostMarkers(selectedPlaceId, {});
  // 반경 원의 중심은 마커 목록이 아니라 summary에서 받는다. 마커 클릭으로 지도가 이동하면
  // 목록이 새 중심 기준으로 다시 조회되어, 선택한 장소가 목록에서 빠질 수 있기 때문이다.
  const { data: selectedPlaceData } = usePlaceSummary(selectedPlaceId);

  const placeMarkers = placesData?.result?.placeMarkers;
  const selectedPlace = selectedPlaceData?.result;
  const showPostMarkers = !isPlaceMode && !isMarkerFetchDisabledByZoom(mapLevel);

  const handleMarkerClick = (postId: number, position: { lat: number; lng: number }) => {
    triggerLevelReset();
    setLatLng(position);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set(MARKER_ID, String(postId));
    router.push(`/?${params.toString()}`, { scroll: false });
    triggerMarkerSheetSnap();
  };

  const handlePlaceMarkerClick = (placeId: number, position: { lat: number; lng: number }) => {
    setLatLng(position);
    const params = new URLSearchParams(searchParams.toString());
    params.set(PLACE_ID_PARAM, String(placeId));
    router.replace(`/?${params.toString()}`, { scroll: false });
    triggerMarkerSheetSnap();
  };

  return (
    <BaseKakaoMap
      center={mapCenter}
      level={mapLevel}
      draggable
      onLevelChange={(nextLevel) => setMapLevel(nextLevel)}
      onDragEnd={(nextCenter) => setLatLng(nextCenter)}
      markerData={
        selectedPlace ? nearbyMarkerData?.result : showPostMarkers ? markerData?.result : undefined
      }
      placeMarkerData={isPlaceMode ? placeMarkers : undefined}
      selectedPlaceId={selectedPlaceId}
      onPlaceMarkerClick={handlePlaceMarkerClick}
      showCircle={!!selectedPlace}
      circleCenter={
        selectedPlace ? { lat: selectedPlace.latitude, lng: selectedPlace.longitude } : undefined
      }
      radius={PLACE_RADIUS_M.outer}
      innerRadius={PLACE_RADIUS_M.inner}
      onMarkerClick={handleMarkerClick}
    />
  );
};

export default MainKakaoMap;
