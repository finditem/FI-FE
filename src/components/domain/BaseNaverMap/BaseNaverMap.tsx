"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Circle, Container, Marker, NaverMap, NavermapsProvider } from "react-naver-maps";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { MapErrorState, MapLoadingState } from "@/components/domain/BaseKakaoMap/_internal";

/**
 * 네이버 지도를 사용하는 모든 화면의 기반이 되는 Base 컴포넌트입니다.
 *
 * @remarks
 * - 네이버 지도 SDK 로딩을 내부에서 처리합니다. 로딩 중에는 `MapLoadingState`, 실패하면 `MapErrorState`를 표시합니다.
 * - 중심 마커, 반경 원(Circle), 드래그 여부 등 공통 기능을 옵션(props)으로 제어합니다.
 * - 지도 위에 표시되는 UI는 children으로 전달받아 렌더링합니다.
 * - 직접 사용하기보다는 화면별 프리셋 래퍼 컴포넌트에서 사용하는 것을 권장합니다.
 * - 부모 요소는 반드시 `height`가 명시되어 있어야 합니다. (`min-height`만 있는 경우 지도가 렌더링되지 않습니다.)
 * - `zoom`은 카카오 `level`과 방향이 반대입니다(클수록 확대). 변환은 `zoom = 20 - level`입니다.
 *
 * @author junyeol
 */

type LatLng = { lat: number; lng: number };

/** 중심 마커 이미지(26x37). 좌표에 맞출 기준점을 카카오 지도에서 쓰던 offset(13, 20)과 같게 둡니다. */
const CENTER_MARKER_ICON: naver.maps.ImageIcon = {
  url: "/kakao-map/marker.svg",
  size: { width: 26, height: 37 },
  scaledSize: { width: 26, height: 37 },
  anchor: { x: 13, y: 20 },
};

const CIRCLE_STYLE = {
  strokeColor: "#1EB87B",
  strokeWeight: 1,
  fillColor: "#1EB87B",
  fillOpacity: 0.15,
};

interface BaseNaverMapProps {
  /** 지도의 중심 좌표 */
  center: LatLng;
  /** 지도 줌 레벨. 클수록 확대됩니다. (default: 14) */
  zoom?: number;
  /** 지도 드래그 가능 여부 (default: false) */
  draggable?: boolean;
  /** 중심 좌표에 마커를 표시할지 여부 (default: false) */
  showCenterMarker?: boolean;
  /** 원(Circle)의 반경 값. `showCircle`이 true일 때만 사용됩니다. */
  radius?: number;
  /** 중심 좌표 기준으로 반경 원(Circle)을 표시할지 여부 */
  showCircle?: boolean;
  /** 지도 드래그 종료 시 호출되는 콜백. 변경된 중심 좌표를 전달합니다. */
  onDragEnd?: (center: LatLng) => void;
  /** 지도 위에 오버레이로 표시할 UI 요소 */
  children?: ReactNode;
  /** 최대 축소 한계 (default: 7, 카카오 레벨 13) */
  minZoom?: number;
  /** 최대 확대 한계 (default: 19, 카카오 레벨 1) */
  maxZoom?: number;
}

/**
 * @example
 * ```tsx
 * <BaseNaverMap
 *   center={{ lat: 37.5665, lng: 126.9780 }}
 *   zoom={14}
 *   showCircle
 *   radius={1000}
 * >
 *   <AddressOverlay />
 * </BaseNaverMap>
 * ```
 */

const BaseNaverMap = ({
  center,
  zoom = 14,
  draggable = false,

  showCenterMarker = false,

  radius,
  showCircle = false,

  onDragEnd,

  children,

  minZoom = 7,
  maxZoom = 19,
}: BaseNaverMapProps) => {
  const mapRef = useRef<naver.maps.Map>(null);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  const handleDragEnd = () => {
    const coord = mapRef.current?.getCenter();
    if (!coord) return;
    const nextCenter = { lat: coord.y, lng: coord.x };
    setMapCenter(nextCenter);
    onDragEnd?.(nextCenter);
  };

  return (
    <div className="relative h-full w-full [backface-visibility:hidden] [transform:translateZ(0)]">
      <ErrorBoundary fallback={<MapErrorState />}>
        {/* geocoder: 지도를 쓰는 화면에서 naver.maps.Service(역지오코딩)를 바로 쓸 수 있게 함께 로드한다 */}
        <NavermapsProvider
          ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID!}
          submodules={["geocoder"]}
        >
          <Container style={{ width: "100%", height: "100%" }} fallback={<MapLoadingState />}>
            <NaverMap
              ref={mapRef}
              center={mapCenter}
              zoom={zoom}
              draggable={draggable}
              minZoom={minZoom}
              maxZoom={maxZoom}
              onDragend={handleDragEnd}
            >
              {showCenterMarker && <Marker position={mapCenter} icon={CENTER_MARKER_ICON} />}

              {showCircle && radius && (
                <Circle center={mapCenter} radius={radius} {...CIRCLE_STYLE} />
              )}
            </NaverMap>
          </Container>
        </NavermapsProvider>
      </ErrorBoundary>

      {children}
    </div>
  );
};

export default BaseNaverMap;
