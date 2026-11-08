import { getDistanceMeters } from "./getDistanceMeters";

const SEONGSU_STATION = { lat: 37.544583, lng: 127.055972 };

describe("getDistanceMeters", () => {
  it("같은 좌표면 0을 반환한다", () => {
    expect(getDistanceMeters(SEONGSU_STATION, SEONGSU_STATION)).toBe(0);
  });

  it("위도 0.001도 차이는 약 111m다", () => {
    const north = { ...SEONGSU_STATION, lat: SEONGSU_STATION.lat + 0.001 };
    expect(getDistanceMeters(SEONGSU_STATION, north)).toBeCloseTo(111, 0);
  });

  it("방향이 바뀌어도 같은 거리를 반환한다", () => {
    const other = { lat: 37.54218, lng: 127.05472 };
    expect(getDistanceMeters(SEONGSU_STATION, other)).toBeCloseTo(
      getDistanceMeters(other, SEONGSU_STATION),
      6
    );
  });

  it("성수역과 약 300m 떨어진 지점을 500m 반경 안으로 판정한다", () => {
    const nearby = { lat: 37.54218, lng: 127.05472 };
    expect(getDistanceMeters(SEONGSU_STATION, nearby)).toBeLessThan(500);
  });
});
