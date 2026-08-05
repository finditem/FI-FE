"use client";

import { BaseKakaoMap } from "@/components";
import useMainKakaoMap from "../../_hooks/useMainKakaoMap/useMainKakaoMap";
import { useGetMarker, isMarkerFetchDisabledByZoom } from "@/api/fetch/mapController";
import { useRouter, useSearchParams } from "next/navigation";
import { MARKER_ID } from "../HOME_CONST";
import { useMainKakaoMapStore } from "@/store";

const MainKakaoMap = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const triggerLevelReset = useMainKakaoMapStore((s) => s.triggerLevelReset);
  const triggerMarkerSheetSnap = useMainKakaoMapStore((s) => s.triggerMarkerSheetSnap);
  const { mapCenter, mapLevel, setMapLevel, setLatLng } = useMainKakaoMap();
  const { data: markerData } = useGetMarker();
  const showPostMarkers = !isMarkerFetchDisabledByZoom(mapLevel);

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
      onMarkerClick={handleMarkerClick}
    />
  );
};

export default MainKakaoMap;
