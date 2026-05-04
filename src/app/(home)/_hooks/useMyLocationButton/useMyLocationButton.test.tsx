import { act, renderHook } from "@testing-library/react";
import { useMainKakaoMapStore } from "@/store";
import { clearMainGeoSessionConfirmed } from "@/utils/mainGeoSession";
import useMyLocationButton from "./useMyLocationButton";

jest.mock("@/store", () => ({
  useMainKakaoMapStore: jest.fn(),
}));

jest.mock("@/utils/mainGeoSession", () => ({
  clearMainGeoSessionConfirmed: jest.fn(),
  hasMainGeoSessionConfirmed: jest.fn(() => false),
  markMainGeoSessionConfirmed: jest.fn(),
}));

const mockClearMainGeoSessionConfirmed = jest.mocked(clearMainGeoSessionConfirmed);

const mockUseMainKakaoMapStore = useMainKakaoMapStore as jest.MockedFunction<
  typeof useMainKakaoMapStore
>;

const createStoreSlice = () => ({
  setLatLng: jest.fn(),
  setUserGpsFromDevice: jest.fn(),
  clearLatLng: jest.fn(),
  triggerLevelReset: jest.fn(),
});

describe("useMyLocationButton", () => {
  let slice: ReturnType<typeof createStoreSlice>;

  beforeEach(() => {
    jest.clearAllMocks();
    slice = createStoreSlice();
    mockUseMainKakaoMapStore.mockImplementation(((selector?: (s: typeof slice) => unknown) => {
      if (typeof selector === "function") {
        return selector(slice as never);
      }
      return slice;
    }) as typeof useMainKakaoMapStore);
  });

  it("geolocation이 없으면 클릭 시 clearLatLng를 호출한다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useMyLocationButton());

    await act(async () => {
      await result.current.handleMyLocationClick();
    });

    expect(slice.clearLatLng).toHaveBeenCalled();
  });

  it("권한이 granted이면 getCurrentPosition으로 위치를 요청한다", async () => {
    const getCurrentPosition = jest.fn((success: PositionCallback) => {
      success({
        coords: { latitude: 37.5, longitude: 127.0 },
      } as GeolocationPosition);
    });

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: { getCurrentPosition },
    });

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      writable: true,
      value: {
        query: jest.fn().mockResolvedValue({ state: "granted" }),
      },
    });

    const { result } = renderHook(() => useMyLocationButton());

    await act(async () => {
      await result.current.handleMyLocationClick();
    });

    expect(getCurrentPosition).toHaveBeenCalled();
    expect(slice.setLatLng).toHaveBeenCalledWith({ lat: 37.5, lng: 127 });
  });

  it("getCurrentPosition 실패 시 clearLatLng를 호출하고 세션 초기화는 하지 않는다", async () => {
    const geoError = {
      code: 2,
      message: "unavailable",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError;

    const getCurrentPosition = jest.fn(
      (_success: PositionCallback, error?: PositionErrorCallback) => {
        error?.(geoError);
      }
    );

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: { getCurrentPosition },
    });

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      writable: true,
      value: {
        query: jest.fn().mockResolvedValue({ state: "granted" }),
      },
    });

    const { result } = renderHook(() => useMyLocationButton());

    await act(async () => {
      await result.current.handleMyLocationClick();
    });

    expect(slice.clearLatLng).toHaveBeenCalled();
    expect(mockClearMainGeoSessionConfirmed).not.toHaveBeenCalled();
  });

  it("getCurrentPosition이 PERMISSION_DENIED이면 clearLatLng와 세션 초기화를 호출한다", async () => {
    const geoError = {
      code: 1,
      message: "denied",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError;

    const getCurrentPosition = jest.fn(
      (_success: PositionCallback, error?: PositionErrorCallback) => {
        error?.(geoError);
      }
    );

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: { getCurrentPosition },
    });

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      writable: true,
      value: {
        query: jest.fn().mockResolvedValue({ state: "granted" }),
      },
    });

    const { result } = renderHook(() => useMyLocationButton());

    await act(async () => {
      await result.current.handleMyLocationClick();
    });

    expect(slice.clearLatLng).toHaveBeenCalled();
    expect(mockClearMainGeoSessionConfirmed).toHaveBeenCalled();
  });

  it("권한이 denied이면 위치 권한 시트를 연다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: { getCurrentPosition: jest.fn() },
    });

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      writable: true,
      value: {
        query: jest.fn().mockResolvedValue({ state: "denied" }),
      },
    });

    const { result } = renderHook(() => useMyLocationButton());

    await act(async () => {
      await result.current.handleMyLocationClick();
    });

    expect(result.current.isLocationPermissionSheetOpen).toBe(true);
  });

  it("closeLocationPermissionSheet로 시트 상태를 끈다", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: { getCurrentPosition: jest.fn() },
    });

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      writable: true,
      value: {
        query: jest.fn().mockResolvedValue({ state: "denied" }),
      },
    });

    const { result } = renderHook(() => useMyLocationButton());

    await act(async () => {
      await result.current.handleMyLocationClick();
    });

    act(() => {
      result.current.closeLocationPermissionSheet();
    });

    expect(result.current.isLocationPermissionSheetOpen).toBe(false);
  });
});
