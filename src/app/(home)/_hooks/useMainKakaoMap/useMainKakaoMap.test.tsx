import { act, renderHook, waitFor } from "@testing-library/react";
import { DEFAULT_LAT_LNG } from "@/constants";
import { useMainKakaoMapStore } from "@/store";
import useMainKakaoMap from "./useMainKakaoMap";

describe("useMainKakaoMap", () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    useMainKakaoMapStore.getState().clearLatLng();
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

    const { result } = renderHook(() => useMainKakaoMap());

    await waitFor(() => {
      expect(result.current.isPermissionResolved).toBe(true);
    });

    expect(result.current.mapCenter).toEqual(DEFAULT_LAT_LNG);
  });

  it("levelResetSignal이 변경되면 mapLevel을 6 이하로 맞춘다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    useMainKakaoMapStore.setState({ mapLevel: 9 });

    const { result } = renderHook(() => useMainKakaoMap());

    await waitFor(() => {
      expect(result.current.isPermissionResolved).toBe(true);
    });

    act(() => {
      useMainKakaoMapStore.getState().triggerLevelReset();
    });

    await waitFor(() => {
      expect(useMainKakaoMapStore.getState().mapLevel).toBe(6);
    });
  });
});
