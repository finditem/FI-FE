export type NeighborhoodPlaceCategory = "POPUP" | "CAFE" | "RESTAURANT";

export type NeighborhoodPlaceFilter = "ALL" | NeighborhoodPlaceCategory;

export type NeighborhoodPlaceStatus = "OPEN" | "UPCOMING";

export interface NeighborhoodPlace {
  id: number;
  name: string;
  imageUrl: string;
  /** 도로명 주소 */
  address: string;
  /** 가장 가까운 지하철역 이름 */
  stationName: string;
  /** 역으로부터의 거리(m) */
  distanceM: number;
  category: NeighborhoodPlaceCategory;
  status: NeighborhoodPlaceStatus;
  /** 운영 기간 또는 영업시간 문구. 예: "26.07.11 ~ 07.13", "07:30~18:00" */
  schedule: string;
}
