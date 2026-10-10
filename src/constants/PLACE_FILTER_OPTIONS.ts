import type { PlaceType } from "@/api/fetch/mapController";

export type PlaceFilterValue = "ALL" | PlaceType;

/** 장소 목록의 종류 필터 칩. 라벨은 `PlaceFilter` 번역 네임스페이스의 키다. */
export const PLACE_FILTER_OPTIONS: { value: PlaceFilterValue; labelKey: string }[] = [
  { value: "ALL", labelKey: "all" },
  { value: "POPUP", labelKey: "popup" },
  { value: "CAFE", labelKey: "cafe" },
  { value: "RESTAURANT", labelKey: "restaurant" },
];
