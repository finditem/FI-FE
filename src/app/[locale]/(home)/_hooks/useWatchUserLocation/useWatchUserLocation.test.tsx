import { act, renderHook } from "@testing-library/react";
import { useMainKakaoMapStore } from "@/store";
import { useGeolocationPermissionGranted } from "@/hooks";
import useWatchUserLocation from "./useWatchUserLocation";

jest.mock("@/store", () => ({
  useMainKakaoMapStore: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  useGeolocationPermissionGranted: jest.fn(() => true),
}));

const mockUseMainKakaoMapStore = useMainKakaoMapStore as jest.MockedFunction<
  typeof useMainKakaoMapStore
>;
const mockUseGeolocationPermissionGranted = jest.mocked(useGeolocationPermissionGranted);

const SEONGSU = { lat: 37.544583, lng: 127.055972 };

const createStoreSlice = () => ({
  userGpsLatLng: SEONGSU,
  setUserGpsFromDevice: jest.fn(),
  setUserGpsLatLng: jest.fn(),
});

const createPosition = (
  lat: number,
  lng: number,
  heading: number | null = null
): GeolocationPosition =>
  ({ coords: { latitude: lat, longitude: lng, heading } }) as GeolocationPosition;

describe("useWatchUserLocation", () => {
  let slice: ReturnType<typeof createStoreSlice>;
  let watchPosition: jest.Mock;
  let clearWatch: jest.Mock;
  let emitPosition: (position: GeolocationPosition) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    slice = createStoreSlice();
    mockUseMainKakaoMapStore.mockImplementation(((selector?: (s: typeof slice) => unknown) => {
      if (typeof selector === "function") {
        return selector(slice as never);
      }
      return slice;
    }) as typeof useMainKakaoMapStore);
    mockUseGeolocationPermissionGranted.mockReturnValue(true);

    watchPosition = jest.fn((success: PositionCallback) => {
      emitPosition = (position) => {
        act(() => {
          success(position);
        });
      };
      return 1;
    });
    clearWatch = jest.fn();

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      writable: true,
      value: { watchPosition, clearWatch },
    });
  });

  it("권한이 없으면 watchPosition을 걸지 않고 좌표도 내보내지 않는다", () => {
    mockUseGeolocationPermissionGranted.mockReturnValue(false);

    const { result } = renderHook(() => useWatchUserLocation());

    expect(watchPosition).not.toHaveBeenCalled();
    expect(result.current.userLocation).toBeNull();
  });

  it("첫 좌표는 주소까지 갱신하고, 이후 좌표는 좌표만 갱신한다", () => {
    renderHook(() => useWatchUserLocation());

    emitPosition(createPosition(37.5446, 127.056));
    expect(slice.setUserGpsFromDevice).toHaveBeenCalledWith({ lat: 37.5446, lng: 127.056 });

    emitPosition(createPosition(37.5456, 127.057));
    expect(slice.setUserGpsLatLng).toHaveBeenCalledWith({ lat: 37.5456, lng: 127.057 });
    expect(slice.setUserGpsFromDevice).toHaveBeenCalledTimes(1);
  });

  it("직전 좌표에서 10m 미만으로 움직이면 반영하지 않는다", () => {
    renderHook(() => useWatchUserLocation());

    emitPosition(createPosition(37.5446, 127.056));
    emitPosition(createPosition(37.54461, 127.05601));

    expect(slice.setUserGpsLatLng).not.toHaveBeenCalled();
  });

  it("heading이 null이면 마지막으로 받은 값을 유지한다", () => {
    const { result } = renderHook(() => useWatchUserLocation());

    expect(result.current.heading).toBeNull();

    emitPosition(createPosition(37.5446, 127.056, 90));
    expect(result.current.heading).toBe(90);

    emitPosition(createPosition(37.5456, 127.057, null));
    expect(result.current.heading).toBe(90);
  });

  it("언마운트되면 clearWatch로 정리한다", () => {
    const { unmount } = renderHook(() => useWatchUserLocation());

    unmount();

    expect(clearWatch).toHaveBeenCalledWith(1);
  });
});
