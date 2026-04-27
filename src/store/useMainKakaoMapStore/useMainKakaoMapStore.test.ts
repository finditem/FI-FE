import { DEFAULT_ADDRESS, DEFAULT_LAT_LNG } from "@/constants";
import { getAddressFromLatLng } from "./getAddressFromLatLng";
import { useMainKakaoMapStore } from "./useMainKakaoMapStore";

jest.mock("./getAddressFromLatLng");

const getAddressMock = jest.mocked(getAddressFromLatLng);

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("useMainKakaoMapStore", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    getAddressMock.mockReset();
    getAddressMock.mockResolvedValue("역삼동");
    useMainKakaoMapStore.getState().clearLatLng();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("setLatLng은 latLng만 바꾸고 즉시 주소 API를 부르지 않습니다", () => {
    useMainKakaoMapStore.getState().setLatLng({ lat: 10, lng: 20 });
    expect(useMainKakaoMapStore.getState().latLng).toEqual({ lat: 10, lng: 20 });
    expect(getAddressMock).not.toHaveBeenCalled();
  });

  it("syncAddressFromLatLng은 디바운스 후 getAddressFromLatLng를 호출하고 address를 갱신합니다", async () => {
    useMainKakaoMapStore.getState().setLatLng({ lat: 1, lng: 2 });
    useMainKakaoMapStore.getState().syncAddressFromLatLng();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).toHaveBeenCalledTimes(1);
    const [lat, lng, signal, opts] = getAddressMock.mock.calls[0];
    expect(lat).toBe(1);
    expect(lng).toBe(2);
    expect(signal).toBeDefined();
    expect(opts).toBeUndefined();
    expect(useMainKakaoMapStore.getState().address).toBe("역삼동");
  });

  it("cancelAddressResolve는 예약된 중심 주소 조회를 취소합니다", async () => {
    useMainKakaoMapStore.getState().setLatLng({ lat: 1, lng: 2 });
    useMainKakaoMapStore.getState().syncAddressFromLatLng();
    useMainKakaoMapStore.getState().cancelAddressResolve();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).not.toHaveBeenCalled();
  });

  it("clearLatLng은 기본 좌표·주소·mapLevel로 되돌립니다", () => {
    useMainKakaoMapStore.setState({
      latLng: { lat: 99, lng: 99 },
      address: "임시",
      mapLevel: 3,
    });
    useMainKakaoMapStore.getState().clearLatLng();
    expect(useMainKakaoMapStore.getState().latLng).toEqual(DEFAULT_LAT_LNG);
    expect(useMainKakaoMapStore.getState().address).toBe(DEFAULT_ADDRESS);
    expect(useMainKakaoMapStore.getState().mapLevel).toBe(6);
  });

  it("triggerLevelReset과 triggerMarkerSheetSnap은 각 시그널을 1씩 올립니다", () => {
    const s0 = useMainKakaoMapStore.getState().levelResetSignal;
    const m0 = useMainKakaoMapStore.getState().markerSheetSnapSignal;
    useMainKakaoMapStore.getState().triggerLevelReset();
    useMainKakaoMapStore.getState().triggerMarkerSheetSnap();
    expect(useMainKakaoMapStore.getState().levelResetSignal).toBe(s0 + 1);
    expect(useMainKakaoMapStore.getState().markerSheetSnapSignal).toBe(m0 + 1);
  });

  it("setUserGpsFromDevice는 userGpsLatLng을 저장하고 full 변형으로 주소를 조회합니다", async () => {
    getAddressMock.mockResolvedValueOnce("도로명 전체");
    useMainKakaoMapStore.getState().setUserGpsFromDevice({ lat: 5, lng: 6 });
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(useMainKakaoMapStore.getState().userGpsLatLng).toEqual({ lat: 5, lng: 6 });
    expect(getAddressMock).toHaveBeenCalledWith(5, 6, expect.any(AbortSignal), { variant: "full" });
    expect(useMainKakaoMapStore.getState().userGpsAddress).toBe("도로명 전체");
  });

  it("syncUserGpsAddress는 저장된 GPS 좌표가 있을 때만 조회합니다", async () => {
    useMainKakaoMapStore.getState().clearLatLng();
    getAddressMock.mockClear();
    useMainKakaoMapStore.getState().syncUserGpsAddress();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).not.toHaveBeenCalled();

    getAddressMock.mockResolvedValueOnce("GPS 주소");
    useMainKakaoMapStore.getState().setUserGpsFromDevice({ lat: 7, lng: 8 });
    jest.advanceTimersByTime(500);
    await flushPromises();
    getAddressMock.mockClear();
    useMainKakaoMapStore.getState().syncUserGpsAddress();
    jest.advanceTimersByTime(500);
    await flushPromises();
    expect(getAddressMock).toHaveBeenCalledWith(7, 8, expect.any(AbortSignal), { variant: "full" });
  });

  it("setMapLevel은 mapLevel을 변경합니다", () => {
    useMainKakaoMapStore.getState().setMapLevel(4);
    expect(useMainKakaoMapStore.getState().mapLevel).toBe(4);
  });
});
