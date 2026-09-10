import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export type PlaceType = "CAFE" | "RESTAURANT" | "POPUP";

export type PlaceOperationStatus = "OPEN" | "BREAK_TIME" | "UPCOMING" | "CLOSED";

export interface PlaceMarker {
  placeId: number;
  latitude: number;
  longitude: number;
  type: PlaceType;
  thumbnailUrl: string;
}

export interface PlaceTimeRange {
  type: "BUSINESS" | "BREAK_TIME";
  /** HH:mm */
  startTime: string;
  /** HH:mm */
  endTime: string;
}

/** 홈 목록·지도 목록·가보고 싶은 목록 공용 요약 모델. */
export interface PlaceSummary {
  placeId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  /** 가장 가까운 역 이름 */
  station: string;
  /** 역과의 거리(m) */
  stationDistanceMeters: number;
  type: PlaceType;
  thumbnailUrl: string;
  operationStatus: PlaceOperationStatus;
  /** `type=POPUP`일 때만. 그 외 null */
  operationPeriod: { startDate: string; endDate: string } | null;
  /** 조회일의 운영시간. 정기 휴무일이면 null */
  todayBusinessHours: PlaceTimeRange[] | null;
  isFavorite: boolean;
}

export interface SearchLocationPlacesResult {
  /** 지도에 표시할 마커, 최대 10개 */
  placeMarkers: PlaceMarker[];
  /** 마커와 같은 장소의 카드 목록, 같은 순서, 최대 10개 */
  places: PlaceSummary[];
  totalCount: number;
}

export interface SearchLocationPlacesResponse extends ApiBaseResponseType<SearchLocationPlacesResult> {}
