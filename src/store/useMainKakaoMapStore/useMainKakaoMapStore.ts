import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LAT_LNG, DEFAULT_ADDRESS } from "@/constants";
import { getAddressFromLatLng } from "./getAddressFromLatLng";
import { debounce } from "lodash";

const ADDRESS_REVALIDATE_DELAY_MS = 500;

/**
 * 메인페이지 카카오 지도 화면에서 사용하는 전역 상태(좌표/주소/줌 리셋 신호) 스토어입니다.
 *
 * @author hyungjun
 * @description
 * - `persist`로 `latLng`, `address`, `userGpsLatLng`, `userGpsAddress`를 로컬 스토리지에 저장합니다.
 * - 좌표가 갱신되어도 주소 API는 바로 호출하지 않으며, `syncAddressFromLatLng`는
 *   UI(예: `RecentFoundItemSection`)에서 `latLng` 변경 시 호출합니다.
 * - 단, 연속적으로 좌표가 바뀌는 경우를 고려해 `setLatLng` 호출 후 `500ms` 동안 추가 입력이 없을 때 1회만 조회합니다(`lodash.debounce`).
 * - 디바운스 실행 시점에 이전 in-flight 요청이 있었다면 `AbortController`로 취소합니다.
 * - `mapLevel`은 현재 카카오 지도 줌 레벨을 전역으로 공유하기 위한 상태입니다.
 * - 내 위치 버튼/리셋 동작 시에는 `levelResetSignal`을 통해 UI가 반응하도록 하며,
 *   `clearLatLng` 호출 시 `mapLevel`도 기본값(6)으로 초기화합니다.
 * - 지도 마커 클릭 시 `markerSheetSnapSignal`을 올려 바텀시트 높이를 다시 맞출 수 있습니다(동일 `marker-id` 재클릭 포함).
 *
 * @example
 * ```ts
 * const { latLng, setLatLng, syncAddressFromLatLng } = useMainKakaoMapStore();
 * setLatLng({ lat: 37.5665, lng: 126.978 });
 * // 화면에서 syncAddressFromLatLng()로 주소 갱신
 * ```
 */

interface MainKakaoMapStore {
  latLng: { lat: number; lng: number };
  setLatLng: (latLng: { lat: number; lng: number }) => void;
  /** 현재 `latLng` 기준 카카오 좌표→주소 조회(디바운스) */
  syncAddressFromLatLng: () => void;
  /** 대기 중인 주소 조회를 취소(최근 발견이 비었을 때 등) */
  cancelAddressResolve: () => void;
  address: string;
  /** 기기 GPS로 확보한 좌표(지도 드래그·중심 이동과 무관). 검색 placeholder용 주소는 이 좌표만 사용 */
  userGpsLatLng: { lat: number; lng: number } | null;
  userGpsAddress: string;
  setUserGpsFromDevice: (latLng: { lat: number; lng: number }) => void;
  syncUserGpsAddress: () => void;
  clearLatLng: () => void;
  mapLevel: number;
  setMapLevel: (level: number) => void;
  levelResetSignal: number;
  triggerLevelReset: () => void;
  markerSheetSnapSignal: number;
  triggerMarkerSheetSnap: () => void;
}

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
