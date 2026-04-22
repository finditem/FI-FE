"use client";

import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { Map, MapMarker, Circle, useKakaoLoader } from "react-kakao-maps-sdk";
import { MapErrorState, MapLoadingState } from "@/components/domain/BaseKakaoMap/_internal";
import { GetMarkerData } from "@/api/fetch/mapController";
import { MAP_MARKER_ICON } from "./MAP_MARKER_ICON";

/**
 * 카카오 지도를 사용하는 모든 화면의 기반이 되는 Base 컴포넌트입니다.
 *
 * @remarks
 * - 카카오 지도 SDK 로딩을 내부에서 처리합니다.
 * - Marker, Circle(반경), 드래그 여부 등 공통 기능을 옵션(props)으로 제어합니다.
 * - 지도 위에 표시되는 UI는 children으로 전달받아 렌더링합니다.
 * - 직접 사용하기보다는 `PostDetailKakaoMap`, `PostWriteKakaoMap` 같은 프리셋 래퍼 컴포넌트에서 사용하는 것을 권장합니다.
 * - 부모 요소는 반드시 `height`가 명시되어 있어야 합니다. (`min-height`만 있는 경우 지도가 렌더링되지 않습니다.)
 *
 * @author jikwon
 */

type LatLng = { lat: number; lng: number };

interface BaseKakaoMapProps {
  /** 지도의 중심 좌표 */
  center: LatLng;
  /** 지도 확대 레벨 (default: 6) */
  level?: number;
  /** 지도 드래그 가능 여부 (default: false) */
  draggable?: boolean;
  /** 지도(Map) 컴포넌트에 전달되는 스타일 객체 (default: `{ width: "100%", height: "100%" }`) */
  style?: CSSProperties;
  /** 중심 좌표에 마커를 표시할지 여부 (default: false) */
  showCenterMarker?: boolean;
  /** 마커 이미지 크기 */
  markerSize?: { width: number; height: number };
  /** 마커 이미지 offset 값 */
  markerOffset?: { x: number; y: number };
  /** 지도에 표시할 마커 데이터 목록 */
  markerData?: GetMarkerData[];
  /** 원(Circle)의 반경 값. `showCircle`이 true일 때만 사용됩니다. */
  radius?: number;
  /** 중심 좌표 기준으로 반경 원(Circle)을 표시할지 여부 */
  showCircle?: boolean;
  /** 지도 드래그 종료 시 호출되는 콜백. 변경된 중심 좌표를 전달합니다. */
  onDragEnd?: (center: LatLng) => void;
  /** 지도 줌 레벨 변경 시 호출되는 콜백 */
  onLevelChange?: (level: number) => void;
  /** 마커 클릭 시 호출되는 콜백 */
  onMarkerClick?: (postId: number, position: LatLng) => void;
  /** 지도 위에 오버레이로 표시할 UI 요소 */
  children?: ReactNode;
  /** 지도 최대 확대 레벨 제한 (default: 13) */
  minLevel?: number;
  /** 지도 최대 축소 레벨 제한 */
  maxLevel?: number;
}

/**
 * @example
 * ```tsx
 * <BaseKakaoMap
 *   center={{ lat: 37.5665, lng: 126.9780 }}
 *   level={6}
 *   showCircle
 *   radius={1000}
 * >
 *   <AddressOverlay />
 * </BaseKakaoMap>
 * ```
 */

const BaseKakaoMap = ({
  center,
  level = 6,
  draggable = false,
  style = { width: "100%", height: "100%" },

  showCenterMarker = false,
  markerSize = { width: 26, height: 37 },
  markerOffset = { x: 13, y: 20 },
  markerData,

  radius,
  showCircle = false,

  onDragEnd,
  onLevelChange,
  onMarkerClick,

  children,

  minLevel = 13,
  maxLevel,
}: BaseKakaoMapProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!,
    libraries: ["services"],
  });

  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  if (loading) return <MapLoadingState />;
  if (error) return <MapErrorState />;

  return (
    <div className="relative h-full w-full [backface-visibility:hidden] [transform:translateZ(0)]">
      <Map
        center={mapCenter}
        level={level}
        draggable={draggable}
        style={style}
        isPanto={true}
        onZoomChanged={(map) => {
          if (!onLevelChange) return;
          onLevelChange(map.getLevel());
        }}
        onDragEnd={(map) => {
          if (!onDragEnd) return;
          const latlng = map.getCenter();
          const nextCenter = {
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          };
          setMapCenter(nextCenter);
          onDragEnd(nextCenter);
        }}
        minLevel={minLevel}
        maxLevel={maxLevel}
      >
        {markerData &&
          markerData.map(({ postId, latitude, longitude, postType }) => (
            <MapMarker
              key={postId}
              position={{ lat: latitude, lng: longitude }}
              image={{
                src: MAP_MARKER_ICON[postType],
                size: markerSize,
                options: { offset: markerOffset },
              }}
              onClick={
                onMarkerClick
                  ? () => onMarkerClick(postId, { lat: latitude, lng: longitude })
                  : undefined
              }
            />
          ))}

        {showCenterMarker && !markerData && (
          <MapMarker
            position={mapCenter}
            image={{
              src: "/kakao-map/marker.svg",
              size: markerSize,
              options: { offset: markerOffset },
            }}
          />
        )}

        {showCircle && radius && (
          <Circle
            center={mapCenter}
            radius={radius}
            strokeColor="#1EB87B"
            strokeWeight={1}
            fillColor="#1EB87B"
            fillOpacity={0.15}
          />
        )}
      </Map>

      {children}
    </div>
  );
};

export default BaseKakaoMap;
