import { getMapZoomByRadius } from "./getMapZoomByRadius";

describe("getMapZoomByRadius", () => {
  it("radius가 1000일 때 14를 반환한다", () => {
    expect(getMapZoomByRadius(1000)).toBe(14);
  });

  it("radius가 3000일 때 13을 반환한다", () => {
    expect(getMapZoomByRadius(3000)).toBe(13);
  });

  it("radius가 5000일 때 12를 반환한다", () => {
    expect(getMapZoomByRadius(5000)).toBe(12);
  });

  it("radius가 없을 때 14를 반환한다", () => {
    expect(getMapZoomByRadius(undefined as any)).toBe(14);
  });
});
