import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LAT_LNG, DEFAULT_ADDRESS } from "@/constants";
import { getAddressFromLatLng } from "./getAddressFromLatLng";
import { debounce } from "lodash";

const ADDRESS_REVALIDATE_DELAY_MS = 500;

/**
 * 메인 화면 카카오 지도에서 쓰는 좌표·주소·줌·UI 신호 전역 스토어입니다.
 *
 * @remarks
 * - `persist`로 `latLng`, `address`, `userGpsLatLng`, `userGpsAddress`만 로컬 스토리지에 둡니다.
 * - 지도 중심 `latLng`에 맞춰 주소를 바꿀 때는 `syncAddressFromLatLng`를 호출하고, 내부는 파일 상수(ms)만큼 `debounce` 후 `getAddressFromLatLng`를 1회 호출합니다.
 * - 디바운스 실행 직전 in-flight 요청은 `AbortController`로 끊습니다.
 * - GPS 전용 좌표는 `setUserGpsFromDevice` / `syncUserGpsAddress` 경로에서 `getAddressFromLatLng`의 `full` 변형을 씁니다.
 * - `clearLatLng`는 지도 중심·주소·GPS·디바운스·`mapLevel`까지 기본값으로 되돌립니다.
 * - `levelResetSignal`, `markerSheetSnapSignal`은 구독 컴포넌트가 카운트 증가만 감지해 일회성 UI 반응에 씁니다.
 *
 * @author hyungjun
 */
interface MainKakaoMapStore {
  /** 지도 중심 좌표 */
  latLng: { lat: number; lng: number };
  /** 지도 중심 좌표만 갱신(주소는 `syncAddressFromLatLng`로 별도) */
  setLatLng: (latLng: { lat: number; lng: number }) => void;
  /** 현재 `latLng` 기준 주소 역지오코딩(디바운스) */
  syncAddressFromLatLng: () => void;
  /** 예약된 중심 주소 조회 취소 */
  cancelAddressResolve: () => void;
  /** 중심 좌표에 대응하는 표시 주소 */
  address: string;
  /** 기기 GPS 좌표(지도 드래그와 무관). 검색 placeholder 등은 이 좌표 기준 주소를 사용 */
  userGpsLatLng: { lat: number; lng: number } | null;
  /** GPS 좌표에 대응하는 주소(`full` 변형) */
  userGpsAddress: string;
  /** GPS 좌표 저장 후 해당 주소 역지오코딩(디바운스·`full`) */
  setUserGpsFromDevice: (latLng: { lat: number; lng: number }) => void;
  /** 저장된 GPS 좌표로 주소만 다시 조회 */
  syncUserGpsAddress: () => void;
  /** 중심·주소·GPS·줌·디바운스 초기화 */
  clearLatLng: () => void;
  /** 카카오 지도 줌 레벨 */
  mapLevel: number;
  /** 줌 레벨 갱신 */
  setMapLevel: (level: number) => void;
  /** 내 위치/줌 리셋 등에 반응하기 위한 단조 증가 신호 */
  levelResetSignal: number;
  /** `levelResetSignal`을 1 증가 */
  triggerLevelReset: () => void;
  /** 마커 탭 시 바텀시트 스냅 등에 쓰는 단조 증가 신호 */
  markerSheetSnapSignal: number;
  /** `markerSheetSnapSignal`을 1 증가 */
  triggerMarkerSheetSnap: () => void;
}

/**
 * @example
 * ```ts
 * const { latLng, setLatLng, syncAddressFromLatLng } = useMainKakaoMapStore();
 * setLatLng({ lat: 37.5665, lng: 126.978 });
 * syncAddressFromLatLng();
 * ```
 */

export const useMainKakaoMapStore = create<MainKakaoMapStore>()(
  persist(
    (set, get) => {
      let abortController: AbortController | null = null;
      let userGpsAbortController: AbortController | null = null;

      const resolveAddressDebounced = debounce(async (lat: number, lng: number) => {
        abortController?.abort();
        abortController = new AbortController();
        const controller = abortController;

        try {
          const address = await getAddressFromLatLng(lat, lng, controller.signal);
          if (controller.signal.aborted) return;
          set({ address });
        } catch {
          if (controller.signal.aborted) return;
          set({ address: "" });
        }
      }, ADDRESS_REVALIDATE_DELAY_MS);

      const resolveUserGpsAddressDebounced = debounce(async (lat: number, lng: number) => {
        userGpsAbortController?.abort();
        userGpsAbortController = new AbortController();
        const controller = userGpsAbortController;

        try {
          const userGpsAddress = await getAddressFromLatLng(lat, lng, controller.signal, {
            variant: "full",
          });
          if (controller.signal.aborted) return;
          set({ userGpsAddress });
        } catch {
          if (controller.signal.aborted) return;
          set({ userGpsAddress: "" });
        }
      }, ADDRESS_REVALIDATE_DELAY_MS);

      return {
        latLng: DEFAULT_LAT_LNG,
        address: DEFAULT_ADDRESS,
        userGpsLatLng: null,
        userGpsAddress: "",
        mapLevel: 6,
        levelResetSignal: 0,
        markerSheetSnapSignal: 0,
        setLatLng: (latLng) => {
          set({ latLng });
        },
        syncAddressFromLatLng: () => {
          const { latLng } = get();
          resolveAddressDebounced(latLng.lat, latLng.lng);
        },
        setUserGpsFromDevice: (latLng) => {
          set({ userGpsLatLng: latLng });
          resolveUserGpsAddressDebounced(latLng.lat, latLng.lng);
        },
        syncUserGpsAddress: () => {
          const g = get().userGpsLatLng;
          if (g) resolveUserGpsAddressDebounced(g.lat, g.lng);
        },
        cancelAddressResolve: () => {
          resolveAddressDebounced.cancel();
          abortController?.abort();
        },
        clearLatLng: () => {
          resolveAddressDebounced.cancel();
          resolveUserGpsAddressDebounced.cancel();
          abortController?.abort();
          userGpsAbortController?.abort();
          set({
            latLng: DEFAULT_LAT_LNG,
            address: DEFAULT_ADDRESS,
            userGpsLatLng: null,
            userGpsAddress: "",
            mapLevel: 6,
          });
        },
        setMapLevel: (level: number) => {
          set({ mapLevel: level });
        },
        triggerLevelReset: () =>
          set((state) => ({
            levelResetSignal: state.levelResetSignal + 1,
          })),
        triggerMarkerSheetSnap: () =>
          set((state) => ({
            markerSheetSnapSignal: state.markerSheetSnapSignal + 1,
          })),
      };
    },
    {
      name: "main-kakao-map-store",
      partialize: (state) => ({
        latLng: state.latLng,
        address: state.address,
        userGpsLatLng: state.userGpsLatLng,
        userGpsAddress: state.userGpsAddress,
      }),
    }
  )
);
