import { act, renderHook, waitFor } from "@testing-library/react";
import { DEFAULT_LAT_LNG } from "@/constants";
import { useMainNaverMapStore } from "@/store";
import useMainNaverMap from "./useMainNaverMap";

describe("useMainNaverMap", () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    useMainNaverMapStore.getState().clearLatLng();
  });

  afterEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: originalGeolocation,
    });
  });

  it("navigator.geolocation이 없으면 즉시 권한 확정으로 처리한다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useMainNaverMap());

    await waitFor(() => {
      expect(result.current.isPermissionResolved).toBe(true);
    });

    expect(result.current.mapCenter).toEqual(DEFAULT_LAT_LNG);
  });

  it("zoomResetSignal이 변경되면 너무 축소된 지도를 줌 14까지 확대한다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    useMainNaverMapStore.setState({ mapZoom: 11 });

    const { result } = renderHook(() => useMainNaverMap());

    await waitFor(() => {
      expect(result.current.isPermissionResolved).toBe(true);
    });

    act(() => {
      useMainNaverMapStore.getState().triggerZoomReset();
    });

    await waitFor(() => {
      expect(useMainNaverMapStore.getState().mapZoom).toBe(14);
    });
  });

  it("zoomResetSignal이 변경돼도 이미 줌 14보다 확대돼 있으면 그대로 둔다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    useMainNaverMapStore.setState({ mapZoom: 16 });

    const { result } = renderHook(() => useMainNaverMap());

    await waitFor(() => {
      expect(result.current.isPermissionResolved).toBe(true);
    });

    act(() => {
      useMainNaverMapStore.getState().triggerZoomReset();
    });

    await waitFor(() => {
      expect(useMainNaverMapStore.getState().mapZoom).toBe(16);
    });
  });
});
