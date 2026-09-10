import { PlaceMarker } from "@/api/fetch/mapController";

/**
 * 성수역 인근 장소 마커 목업.
 *
 * ponytail: 백엔드 `/main/places/search-location`이 200을 주지만 성수동 장소 데이터가
 * 아직 비어 있어(`placeMarkers: []`), 개발 환경에서만 이 목업으로 대체한다.
 * 실제 데이터가 들어오면 이 파일과 `MainKakaoMap`의 목업 분기를 삭제한다.
 */
export const MOCK_PLACE_MARKERS: PlaceMarker[] = [
  {
    placeId: 9001,
    latitude: 37.5442,
    longitude: 127.0552,
    type: "POPUP",
    thumbnailUrl: "https://picsum.photos/seed/place-popup-1/200/200",
  },
  {
    placeId: 9002,
    latitude: 37.5431,
    longitude: 127.0567,
    type: "POPUP",
    thumbnailUrl: "https://picsum.photos/seed/place-popup-2/200/200",
  },
  {
    placeId: 9003,
    latitude: 37.5458,
    longitude: 127.0549,
    type: "POPUP",
    thumbnailUrl: "https://picsum.photos/seed/place-popup-3/200/200",
  },
  {
    placeId: 9101,
    latitude: 37.5449,
    longitude: 127.0574,
    type: "CAFE",
    thumbnailUrl: "https://picsum.photos/seed/place-cafe-1/200/200",
  },
  {
    placeId: 9102,
    latitude: 37.5417,
    longitude: 127.0561,
    type: "CAFE",
    thumbnailUrl: "https://picsum.photos/seed/place-cafe-2/200/200",
  },
  {
    placeId: 9201,
    latitude: 37.5453,
    longitude: 127.0538,
    type: "RESTAURANT",
    thumbnailUrl: "https://picsum.photos/seed/place-restaurant-1/200/200",
  },
  {
    placeId: 9202,
    latitude: 37.5426,
    longitude: 127.0581,
    type: "RESTAURANT",
    thumbnailUrl: "https://picsum.photos/seed/place-restaurant-2/200/200",
  },
];
