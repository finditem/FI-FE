/** 웹 메르카토르에서 줌 0일 때 세계 지도 한 변의 픽셀 수. 네이버 지도 줌도 이 기준을 따른다. */
const WORLD_SIZE_AT_ZOOM_0 = 256;

/**
 * 좌표를 화면에서 `offsetY` 픽셀만큼 아래(남쪽)로 옮긴 좌표를 돌려준다.
 *
 * @remarks
 * - 지도 중심을 이 좌표로 맞추면 원래 좌표는 화면 가운데보다 `offsetY` 픽셀 위에 보인다.
 *   바텀시트가 지도 아래쪽을 가릴 때 대상을 보이는 영역 가운데로 올리는 데 쓴다.
 * - 같은 픽셀이라도 줌에 따라 거리가 달라지므로 이동을 마칠 목표 줌을 넘긴다.
 *
 * @param latLng - 기준 좌표
 * @param offsetY - 아래로 옮길 CSS 픽셀. 0이면 기준 좌표를 그대로 돌려준다.
 * @param zoom - 네이버 지도 줌
 *
 * @example
 * ```ts
 * const center = offsetLatLngByPixels(userLatLng, sheetHeight / 2, DEFAULT_MAP_ZOOM);
 * ```
 */
export const offsetLatLngByPixels = (
  latLng: { lat: number; lng: number },
  offsetY: number,
  zoom: number
) => {
  if (offsetY === 0) return latLng;

  const worldSize = WORLD_SIZE_AT_ZOOM_0 * 2 ** zoom;
  const sinLat = Math.sin((latLng.lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * worldSize + offsetY;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / worldSize))) * 180) / Math.PI;

  return { lat, lng: latLng.lng };
};
