import { isMapZoomFetchDisabled } from "./isMapZoomFetchDisabled";

describe("isMapZoomFetchDisabled", () => {
  it("줌 11 이하(카카오 레벨 9 이상)로 축소하면 조회를 끈다", () => {
    expect(isMapZoomFetchDisabled(11)).toBe(true);
    expect(isMapZoomFetchDisabled(7)).toBe(true);
  });

  it("줌 12 이상(카카오 레벨 8 이하)이면 조회한다", () => {
    expect(isMapZoomFetchDisabled(12)).toBe(false);
    expect(isMapZoomFetchDisabled(15)).toBe(false);
  });
});
