import { DEFAULT_ADDRESS, DEFAULT_LAT_LNG, DEFAULT_MAP_ZOOM } from "@/constants";
import { getAddressFromLatLng } from "./getAddressFromLatLng";
import { useMainNaverMapStore } from "./useMainNaverMapStore";

jest.mock("./getAddressFromLatLng");

const getAddressMock = jest.mocked(getAddressFromLatLng);

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("useMainNaverMapStore", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    getAddressMock.mockReset();
    getAddressMock.mockResolvedValue("역삼동");
    useMainNaverMapStore.getState().clearLatLng();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("setLatLng은 latLng만 바꾸고 즉시 주소 API를 부르지 않습니다", () => {
    useMainNaverMapStore.getState().setLatLng({ lat: 10, lng: 20 });
    expect(useMainNaverMapStore.getState().latLng).toEqual({ lat: 10, lng: 20 });
    expect(getAddressMock).not.toHaveBeenCalled();
  });

  it("syncAddressFromLatLng은 디바운스 후 getAddressFromLatLng를 호출하고 address를 갱신합니다", async () => {
    useMainNaverMapStore.getState().setLatLng({ lat: 1, lng: 2 });
    useMainNaverMapStore.getState().syncAddressFromLatLng();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).toHaveBeenCalledTimes(1);
    const [lat, lng, signal, opts] = getAddressMock.mock.calls[0];
    expect(lat).toBe(1);
    expect(lng).toBe(2);
    expect(signal).toBeDefined();
    expect(opts).toBeUndefined();
    expect(useMainNaverMapStore.getState().address).toBe("역삼동");
  });

  it("cancelAddressResolve는 예약된 중심 주소 조회를 취소합니다", async () => {
    useMainNaverMapStore.getState().setLatLng({ lat: 1, lng: 2 });
    useMainNaverMapStore.getState().syncAddressFromLatLng();
    useMainNaverMapStore.getState().cancelAddressResolve();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).not.toHaveBeenCalled();
  });

  it("clearLatLng은 기본 좌표·주소·mapZoom로 되돌립니다", () => {
    useMainNaverMapStore.setState({
      latLng: { lat: 99, lng: 99 },
      address: "임시",
      mapZoom: 3,
    });
    useMainNaverMapStore.getState().clearLatLng();
    expect(useMainNaverMapStore.getState().latLng).toEqual(DEFAULT_LAT_LNG);
    expect(useMainNaverMapStore.getState().address).toBe(DEFAULT_ADDRESS);
    expect(useMainNaverMapStore.getState().mapZoom).toBe(DEFAULT_MAP_ZOOM);
  });

  it("triggerZoomReset과 triggerMarkerSheetSnap은 각 시그널을 1씩 올립니다", () => {
    const s0 = useMainNaverMapStore.getState().zoomResetSignal;
    const m0 = useMainNaverMapStore.getState().markerSheetSnapSignal;
    useMainNaverMapStore.getState().triggerZoomReset();
    useMainNaverMapStore.getState().triggerMarkerSheetSnap();
    expect(useMainNaverMapStore.getState().zoomResetSignal).toBe(s0 + 1);
    expect(useMainNaverMapStore.getState().markerSheetSnapSignal).toBe(m0 + 1);
  });

  it("setUserGpsFromDevice는 userGpsLatLng을 저장하고 full 변형으로 주소를 조회합니다", async () => {
    getAddressMock.mockResolvedValueOnce("도로명 전체");
    useMainNaverMapStore.getState().setUserGpsFromDevice({ lat: 5, lng: 6 });
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(useMainNaverMapStore.getState().userGpsLatLng).toEqual({ lat: 5, lng: 6 });
    expect(getAddressMock).toHaveBeenCalledWith(5, 6, expect.any(AbortSignal), { variant: "full" });
    expect(useMainNaverMapStore.getState().userGpsAddress).toBe("도로명 전체");
  });

  it("setUserGpsLatLng은 좌표만 갱신하고 주소는 조회하지 않습니다", async () => {
    getAddressMock.mockResolvedValueOnce("도로명 전체");
    useMainNaverMapStore.getState().setUserGpsFromDevice({ lat: 5, lng: 6 });
    jest.advanceTimersByTime(500);
    await flushPromises();
    getAddressMock.mockClear();

    useMainNaverMapStore.getState().setUserGpsLatLng({ lat: 9, lng: 10 });
    jest.advanceTimersByTime(500);
    await flushPromises();

    expect(useMainNaverMapStore.getState().userGpsLatLng).toEqual({ lat: 9, lng: 10 });
    expect(useMainNaverMapStore.getState().userGpsAddress).toBe("도로명 전체");
    expect(getAddressMock).not.toHaveBeenCalled();
  });

  it("syncUserGpsAddress는 저장된 GPS 좌표가 있을 때만 조회합니다", async () => {
    useMainNaverMapStore.getState().clearLatLng();
    getAddressMock.mockClear();
    useMainNaverMapStore.getState().syncUserGpsAddress();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).not.toHaveBeenCalled();

    getAddressMock.mockResolvedValueOnce("GPS 주소");
    useMainNaverMapStore.getState().setUserGpsFromDevice({ lat: 7, lng: 8 });
    jest.advanceTimersByTime(500);
    await flushPromises();
    getAddressMock.mockClear();
    useMainNaverMapStore.getState().syncUserGpsAddress();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).toHaveBeenCalledWith(7, 8, expect.any(AbortSignal), { variant: "full" });
  });

  it("setMapZoom은 mapZoom을 변경합니다", () => {
    useMainNaverMapStore.getState().setMapZoom(4);
    expect(useMainNaverMapStore.getState().mapZoom).toBe(4);
  });
});
