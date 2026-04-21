import { create } from "zustand";
import type { PostType, Radius } from "@/types";

/**
 * 게시글 작성 시 위치 및 게시글 타입 상태를 관리하는 Zustand 스토어입니다.
 *
 * @author jikwon
 */

type WriteStore = {
  /** 위도 */
  lat: number | null;
  /** 경도 */
  lng: number | null;
  /** 동 단위 주소 */
  address: string | null;
  /** 전체 도로명 주소 */
  fullAddress: string | null;
  /** 지도 반경 (단위: m) */
  radius: Radius | null;

  /** 위도/경도 설정 */
  setLatLng: (lat: number | null, lng: number | null) => void;
  /** 동 단위 주소 설정 */
  setAddress: (address: string | null) => void;
  /** 전체 도로명 주소 설정 */
  setFullAddress: (fullAddress: string | null) => void;
  /** 반경 설정 */
  setRadius: (radius: Radius | null) => void;

  /** 게시글 타입 */
  postType: PostType | null;
  /** 게시글 타입 설정 */
  setPostType: (type: PostType) => void;

  /** 위치 관련 상태(lat, lng, address, fullAddress, radius) 초기화 */
  clearLocation: () => void;
};

export const useWriteStore = create<WriteStore>((set) => ({
  lat: null,
  lng: null,
  address: null,
  fullAddress: null,
  radius: null,
  postType: null,

  setLatLng: (lat, lng) => set({ lat, lng }),
  setAddress: (address) => set({ address }),
  setFullAddress: (fullAddress) => set({ fullAddress }),
  setRadius: (radius) => set({ radius }),
  setPostType: (postType) => set({ postType }),
  clearLocation: () =>
    set({ lat: null, lng: null, address: null, fullAddress: null, radius: null }),
}));
