import { create } from "zustand";

/**
 * 인증 상태를 관리하는 Zustand 스토어입니다.
 *
 * @author jikwon
 */

interface AuthStore {
  /** 인증 상태 확인 완료 여부 (true: 로그인/로그아웃 상태 확정, false: 확인 중) */
  isAuthInitialized: boolean;
  /** 인증 초기화 상태를 설정합니다 */
  setAuthInitialized: (val: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthInitialized: false,
  setAuthInitialized: (val) => set({ isAuthInitialized: val }),
}));
