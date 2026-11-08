import { offsetLatLngByPixels } from "./mapOffsetUtils";

const SEONGSU = { lat: 37.544583, lng: 127.055972 };
const METERS_PER_LAT_DEGREE = 111_320;

describe("offsetLatLngByPixels", () => {
  it("오프셋이 0이면 같은 좌표 객체를 그대로 돌려준다", () => {
    expect(offsetLatLngByPixels(SEONGSU, 0, 15)).toBe(SEONGSU);
  });

  it("성수동 위도, 줌 15에서 200px 아래로 옮기면 약 758m 남쪽 좌표가 된다", () => {
    const shifted = offsetLatLngByPixels(SEONGSU, 200, 15);
    const meters = (SEONGSU.lat - shifted.lat) * METERS_PER_LAT_DEGREE;

    expect(meters).toBeCloseTo(757.6, 0);
    expect(shifted.lng).toBe(SEONGSU.lng);
  });

  it("음수 오프셋이면 같은 거리만큼 북쪽으로 옮긴다", () => {
    const south = offsetLatLngByPixels(SEONGSU, 200, 15);
    const north = offsetLatLngByPixels(SEONGSU, -200, 15);

    expect(north.lat).toBeGreaterThan(SEONGSU.lat);
    expect(north.lat - SEONGSU.lat).toBeCloseTo(SEONGSU.lat - south.lat, 5);
  });

  it("줌이 1 커지면 같은 픽셀의 이동 거리가 절반이 된다", () => {
    const atZoom15 = SEONGSU.lat - offsetLatLngByPixels(SEONGSU, 200, 15).lat;
    const atZoom16 = SEONGSU.lat - offsetLatLngByPixels(SEONGSU, 200, 16).lat;

    expect(atZoom16).toBeCloseTo(atZoom15 / 2, 6);
  });
});
