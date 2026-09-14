import type { PlaceSummary, PlaceType } from "@/api/fetch/mapController";

export type NeighborhoodPlaceCategory = PlaceType;

export type NeighborhoodPlaceFilter = "ALL" | NeighborhoodPlaceCategory;

/**
 * 동네 구경 목록과 장소 상세 시트가 함께 쓰는 장소 모델.
 * 서버 응답(`PlaceSummary`)을 그대로 쓴다 — 별도 화면용 타입을 두면 매핑 코드만 늘어난다.
 */
export type NeighborhoodPlace = PlaceSummary;
