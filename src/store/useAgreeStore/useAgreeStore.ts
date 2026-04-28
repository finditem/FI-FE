import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 카카오 로그인 상태 및 필수 약관 동의 여부를 관리하는 스토어입니다.
 *
 * @remarks
 * - `persist` 미들웨어를 사용하여 `term-storage`라는 키로 로컬 스토리지에 상태를 동기화합니다.
 * - 로그인 후 필수 약관에 동의하지 않은 사용자를 판별하여 서비스 접근을 제어하는 가드 로직의 기반이 됩니다.
 * - `logout` 시 모든 상태를 초기화하여 브라우저에 남아있는 인증 흔적을 제거합니다.
 *
 * @returns 인증 상태 및 제어 핸들러 객체
 * - `isLoggedIn`: 현재 사용자의 로그인 여부
 * - `termsAgreed`: 필수 서비스 이용 약관 동의 완료 여부
 * - `login`: 로그인 성공 시 호출하며, 서버로부터 받은 약관 동의 여부를 주입합니다.
 * - `logout`: 로그아웃 시 호출하여 스토리지의 모든 인증 상태를 초기화합니다.
 * - `setAgreed`: 약관 동의 절차를 성공적으로 마쳤을 때 동의 상태를 true로 업데이트합니다.
 *
 * @author suhyeon
 */

interface AuthState {
  /** 사용자의 로그인 상태 (true: 로그인됨) */
  isLoggedIn: boolean;
  /** 필수 약관 동의 여부 (true: 동의 완료) */
  termsAgreed: boolean;
  /**
   * 로그인 상태를 활성화합니다.
   * @param agreed - 사용자의 기존 약관 동의 기록 여부
   */
  login: (agreed: boolean) => void;
  /** 인증 상태를 모두 초기화하고 로그아웃합니다. */
  logout: () => void;
  /** 약관 동의 완료 상태를 true로 설정합니다. */
  setAgreed: () => void;
}

/**
 * @example
 * ```ts
 * const { isLoggedIn, termsAgreed, login, logout, setAgreed } = useAgreeStore();
 *
 * // 1. 로그인 API 성공 시
 * login(response.data.termsAgreed);
 *
 * // 2. 약관 동의 완료 시
 * setAgreed();
 *
 * // 3. 로그아웃 또는 세션 만료 시
 * logout();
 * ```
 */

export const useAgreeStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      termsAgreed: false,

      login: (agreed) =>
        set({
          isLoggedIn: true,
          termsAgreed: agreed,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          termsAgreed: false,
        }),

      setAgreed: () =>
        set({
          termsAgreed: true,
        }),
    }),
    {
      name: "term-storage",
    }
  )
);
