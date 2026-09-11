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

export interface PlaceSummary {
  placeId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  station: string;
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
  placeMarkers: PlaceMarker[];
  /** `placeMarkers`와 같은 장소를 같은 순서로 담는다 */
  places: PlaceSummary[];
  totalCount: number;
}

export interface SearchLocationPlacesResponse extends ApiBaseResponseType<SearchLocationPlacesResult> {}
