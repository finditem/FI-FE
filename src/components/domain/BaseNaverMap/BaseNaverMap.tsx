"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useLocale } from "next-intl";
import {
  Circle,
  Container,
  CustomOverlay,
  Marker,
  NaverMap,
  NavermapsProvider,
} from "react-naver-maps";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { MapErrorState, MapLoadingState } from "@/components/domain/BaseKakaoMap/_internal";
import { MAP_MARKER_ICON } from "@/components/domain/BaseKakaoMap/MAP_MARKER_ICON";
import { GetMarkerData, PlaceMarker } from "@/api/fetch/mapController";
import { cn } from "@/utils";

/**
 * 네이버 지도를 사용하는 모든 화면의 기반이 되는 Base 컴포넌트입니다.
 *
 * @remarks
 * - 네이버 지도 SDK 로딩을 내부에서 처리합니다. 로딩 중에는 `MapLoadingState`, 실패하면 `MapErrorState`를 표시합니다.
 * - 마커, 반경 원(Circle), 드래그 여부 등 공통 기능을 옵션(props)으로 제어합니다.
 * - 지도 위에 표시되는 UI는 children으로 전달받아 렌더링합니다.
 * - 직접 사용하기보다는 화면별 프리셋 래퍼 컴포넌트에서 사용하는 것을 권장합니다.
 * - 부모 요소는 반드시 `height`가 명시되어 있어야 합니다. (`min-height`만 있는 경우 지도가 렌더링되지 않습니다.)
 * - `zoom`은 카카오 `level`과 방향이 반대입니다(클수록 확대). 변환은 `zoom = 20 - level`입니다.
 *
 * @author junyeol
 */

type LatLng = { lat: number; lng: number };

/**
 * 네이버 지도 스크립트를 직접 로드하는 주소를 만듭니다.
 *
 * @remarks
 * - react-naver-maps는 `language` 파라미터를 넘기지 못하지만, 이미 로드된 `naver.maps`가 있으면 그대로 재사용합니다.
 *   그래서 언어를 붙인 스크립트를 먼저 로드한 뒤 `NavermapsProvider`를 그립니다.
 * - 지도 라벨만 바뀌고, 역지오코딩 결과(게시글 저장 주소)는 언어와 관계없이 한국어로 옵니다.
 * - 스크립트는 페이지당 한 번만 로드되므로, 언어를 바꿀 때는 페이지를 새로 불러와야 지도 언어가 바뀝니다.
 */
const getNaverMapScriptSrc = (language: string) =>
  `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID}&submodules=geocoder&language=${language}`;

/** 마커 이미지(26x37)의 크기. 좌표에 맞출 기준점을 카카오 지도에서 쓰던 offset(13, 20)과 같게 둡니다. */
const markerIcon = (url: string): naver.maps.ImageIcon => ({
  url,
  size: { width: 26, height: 37 },
  scaledSize: { width: 26, height: 37 },
  anchor: { x: 13, y: 20 },
});

const CENTER_MARKER_ICON = markerIcon("/kakao-map/marker.svg");

const POST_MARKER_ICON = {
  LOST: markerIcon(MAP_MARKER_ICON.LOST),
  FOUND: markerIcon(MAP_MARKER_ICON.FOUND),
};

/** 사용자 위치 마커 SVG(48x48 viewBox)의 기준값입니다. */
const USER_LOCATION_MARKER = {
  src: "/kakao-map/user-location.svg",
  size: 48,
  dotCenter: { x: 23.625, y: 16.625 },
  arrowBearingDeg: 311.6,
} as const;

/** 마커의 점 중심이 오버레이 중앙(지도 좌표)에 오도록 맞추는 보정값 */
const USER_LOCATION_MARKER_OFFSET = {
  x: USER_LOCATION_MARKER.size / 2 - USER_LOCATION_MARKER.dotCenter.x,
  y: USER_LOCATION_MARKER.size / 2 - USER_LOCATION_MARKER.dotCenter.y,
};

const CIRCLE_STYLE = {
  strokeColor: "#1EB87B",
  strokeWeight: 1,
  fillColor: "#1EB87B",
  fillOpacity: 0.15,
};

/**
 * 네이버 `CustomOverlay`는 내용의 왼쪽 위를 좌표에 맞춥니다.
 * 카카오 `CustomOverlayMap`처럼 내용의 가운데가 좌표에 오도록 옮깁니다.
 */
const CenteredOverlay = ({ position, children }: { position: LatLng; children: ReactNode }) => (
  <CustomOverlay position={position}>
    <div className="-translate-x-1/2 -translate-y-1/2">{children}</div>
  </CustomOverlay>
);

interface BaseNaverMapProps {
  /** 지도의 중심 좌표 */
  center: LatLng;
  /** 지도 줌 레벨. 클수록 확대됩니다. (default: 14) */
  zoom?: number;
  /** 지도 드래그 가능 여부 (default: false) */
  draggable?: boolean;
  /** 중심 좌표에 마커를 표시할지 여부. `markerData`가 있으면 표시하지 않습니다. (default: false) */
  showCenterMarker?: boolean;
  /** 지도에 표시할 게시글 마커 목록 */
  markerData?: GetMarkerData[];
  /** 게시글 마커 클릭 핸들러 */
  onMarkerClick?: (postId: number, position: LatLng) => void;
  /** 지도에 표시할 장소(팝업/카페/맛집) 마커 목록. 원형 썸네일로 렌더링됩니다. */
  placeMarkerData?: PlaceMarker[];
  /** 장소 마커 클릭 핸들러 */
  onPlaceMarkerClick?: (placeId: number, position: LatLng) => void;
  /** 선택되어 강조할 장소의 `placeId` */
  selectedPlaceId?: number | null;
  /** 사용자의 현재 위치. 값이 있으면 그 좌표에 사용자 위치 마커를 표시합니다. */
  userLocation?: LatLng | null;
  /** 사용자의 진행 방향(북쪽 기준 시계방향 각도). 마커의 화살표가 이 방향을 가리킵니다. */
  userHeading?: number | null;
  /** 원(Circle)의 반경 값. `showCircle`이 true일 때만 사용됩니다. */
  radius?: number;
  /** 반경 원(Circle)을 표시할지 여부 */
  showCircle?: boolean;
  /** 반경 원의 중심. 생략하면 지도 중심(`center`)에 그립니다. */
  circleCenter?: LatLng;
  /** 함께 그릴 안쪽 원의 반경. 생략하면 바깥 원만 그립니다. */
  innerRadius?: number;
  /** 지도 드래그 종료 시 호출되는 콜백. 변경된 중심 좌표를 전달합니다. */
  onDragEnd?: (center: LatLng) => void;
  /** 지도 줌 변경 시 호출되는 콜백 */
  onZoomChange?: (zoom: number) => void;
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
  markerData,
  onMarkerClick,
  placeMarkerData,
  onPlaceMarkerClick,
  selectedPlaceId,
  userLocation,
  userHeading,

  radius,
  showCircle = false,
  circleCenter,
  innerRadius,

  onDragEnd,
  onZoomChange,

  children,

  minZoom = 7,
  maxZoom = 19,
}: BaseNaverMapProps) => {
  const locale = useLocale();
  const [scriptStatus, setScriptStatus] = useState<"loading" | "ready" | "error">("loading");
  const mapRef = useRef<naver.maps.Map>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const prevCenterRef = useRef(center);

  // react-naver-maps는 center prop이 바뀌면 애니메이션 없이 순간 이동하고, zoom prop은 이동 중에도 따로 적용한다.
  // 카카오 isPanto처럼 미끄러지듯 이동하면서 흔들리지 않도록 중심과 줌을 직접 옮긴다.
  // - 줌이 바뀌면 이동과 줌을 한 번에 처리하는 morph를 쓴다. 이동 중에 줌만 바뀌어도 목표 중심으로 이어서 이동한다.
  // - 중심만 바뀌면 panTo를 쓴다.
  // - center prop이 그대로면 옮기지 않는다. 사용자가 휠이나 핀치로 줌하면 지도 중심이 이미 바뀌어 있는데,
  //   이때 예전 center로 panTo하면 지도가 원래 자리로 되돌아간다.
  useEffect(() => {
    setMapCenter(center);
    const isCenterChanged =
      prevCenterRef.current.lat !== center.lat || prevCenterRef.current.lng !== center.lng;
    prevCenterRef.current = center;
    const map = mapRef.current;
    if (!map) return;

    if (map.getZoom() !== zoom) {
      map.morph(center, zoom);
      return;
    }
    if (!isCenterChanged) return;

    const current = map.getCenter();
    if (current.y !== center.lat || current.x !== center.lng) {
      map.panTo(center);
    }
  }, [center, zoom]);

  const handleDragEnd = () => {
    const coord = mapRef.current?.getCenter();
    if (!coord) return;
    const nextCenter = { lat: coord.y, lng: coord.x };
    // 부모가 이 좌표를 center로 돌려줘도 panTo하지 않게 한다. 드래그 뒤 관성 이동 중에 손 뗀 지점으로 끌려가지 않는다.
    prevCenterRef.current = nextCenter;
    setMapCenter(nextCenter);
    onDragEnd?.(nextCenter);
  };

  return (
    <div className="relative h-full w-full [backface-visibility:hidden] [transform:translateZ(0)]">
      <Script
        src={getNaverMapScriptSrc(locale)}
        onReady={() => setScriptStatus("ready")}
        onError={() => setScriptStatus("error")}
      />
      {scriptStatus === "loading" && <MapLoadingState />}
      {scriptStatus === "error" && <MapErrorState />}
      {scriptStatus === "ready" && (
        <ErrorBoundary fallback={<MapErrorState />}>
          {/* geocoder: 지도를 쓰는 화면에서 naver.maps.Service(역지오코딩)를 바로 쓸 수 있게 함께 로드한다 */}
          <NavermapsProvider
            ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID!}
            submodules={["geocoder"]}
          >
            <Container style={{ width: "100%", height: "100%" }} fallback={<MapLoadingState />}>
              <NaverMap
                ref={mapRef}
                defaultCenter={center}
                defaultZoom={zoom}
                draggable={draggable}
                minZoom={minZoom}
                maxZoom={maxZoom}
                onDragend={handleDragEnd}
                onZoomChanged={onZoomChange}
              >
                {markerData?.map(({ postId, latitude, longitude, postType }) => (
                  <Marker
                    key={postId}
                    position={{ lat: latitude, lng: longitude }}
                    icon={POST_MARKER_ICON[postType]}
                    onClick={
                      onMarkerClick
                        ? () => onMarkerClick(postId, { lat: latitude, lng: longitude })
                        : undefined
                    }
                  />
                ))}

                {placeMarkerData?.map(({ placeId, latitude, longitude, thumbnailUrl }) => (
                  <CenteredOverlay key={placeId} position={{ lat: latitude, lng: longitude }}>
                    <button
                      type="button"
                      aria-pressed={selectedPlaceId === placeId}
                      onClick={() =>
                        onPlaceMarkerClick?.(placeId, { lat: latitude, lng: longitude })
                      }
                      className={cn(
                        "block overflow-hidden rounded-full border-white bg-[#D9D9D9] shadow-[0_3px_4px_rgba(0,0,0,0.17)]",
                        selectedPlaceId === placeId
                          ? "h-12 w-12 border-4"
                          : "h-10 w-10 border-[3px]"
                      )}
                    >
                      <Image
                        src={thumbnailUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </CenteredOverlay>
                ))}

                {userLocation && (
                  <CenteredOverlay position={userLocation}>
                    <div className="relative h-12 w-12">
                      <div className="absolute inset-0 rounded-full bg-green-500/35" />
                      <div className="animate-user-location-pulse absolute inset-0 rounded-full bg-green-500/35" />
                      <Image
                        src={USER_LOCATION_MARKER.src}
                        alt=""
                        width={USER_LOCATION_MARKER.size}
                        height={USER_LOCATION_MARKER.size}
                        className="absolute left-0 top-0"
                        style={{
                          transform: `translate(${USER_LOCATION_MARKER_OFFSET.x}px, ${USER_LOCATION_MARKER_OFFSET.y}px) rotate(${(userHeading ?? USER_LOCATION_MARKER.arrowBearingDeg) - USER_LOCATION_MARKER.arrowBearingDeg}deg)`,
                          transformOrigin: `${USER_LOCATION_MARKER.dotCenter.x}px ${USER_LOCATION_MARKER.dotCenter.y}px`,
                        }}
                      />
                    </div>
                  </CenteredOverlay>
                )}

                {showCenterMarker && !markerData && (
                  <Marker position={mapCenter} icon={CENTER_MARKER_ICON} />
                )}

                {showCircle && radius && (
                  <>
                    <Circle center={circleCenter ?? mapCenter} radius={radius} {...CIRCLE_STYLE} />
                    {innerRadius && (
                      <Circle
                        center={circleCenter ?? mapCenter}
                        radius={innerRadius}
                        {...CIRCLE_STYLE}
                      />
                    )}
                  </>
                )}
              </NaverMap>
            </Container>
          </NavermapsProvider>
        </ErrorBoundary>
      )}

      {children}
    </div>
  );
};

export default BaseNaverMap;
