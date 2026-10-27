import { create } from "zustand";

/** 확인 중·로그인·게스트·일시 장애를 구분하는 클라이언트 인증 상태입니다. */
type AuthStatus = "checking" | "authenticated" | "anonymous" | "unavailable";

interface AuthStore {
  /** 쿠키 존재 여부와 별개로 확인한 현재 인증 상태입니다. */
  status: AuthStatus;
  /** 인증 상태와 초기 확인 완료 여부를 함께 갱신합니다. */
  setStatus: (status: AuthStatus) => void;
  /** checking 여부에서 파생됩니다. true만으로 로그인 여부를 판단하지 않습니다. */
  isAuthInitialized: boolean;
}

/**
 * 인증 상태와 기존 소비자의 초기화 완료 플래그를 함께 관리합니다.
 * @remarks 초기화 플래그의 독립 setter를 두지 않아 상태가 서로 어긋나지 않게 합니다.
 * @example
 * const isAuthenticated = useAuthStore((state) => state.status === "authenticated");
 */
export const useAuthStore = create<AuthStore>((set) => ({
  status: "checking",
  setStatus: (status) => set({ status, isAuthInitialized: status !== "checking" }),
  isAuthInitialized: false,
}));
