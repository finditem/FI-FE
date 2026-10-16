/**
 * 이 줌 이하로 축소하면 마커와 최근 습득물 조회를 끈다.
 * 카카오 레벨 9에서 13 사이에서 끄던 것과 같은 범위다(`zoom = 20 - level`).
 */
const MAP_FETCH_DISABLED_MAX_ZOOM = 11;

export const isMapZoomFetchDisabled = (mapZoom: number): boolean => {
  return mapZoom <= MAP_FETCH_DISABLED_MAX_ZOOM;
};
