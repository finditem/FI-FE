import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 카카오 로그인의 약관 동의 상태를 관리하는 스토어입니다.
 *
 * @author suhyeon
 * @description
 * - `persist`를 통해 로그인 여부와 약관 동의 상태를 `term-storage`라는 키로 로컬 스토리지에 저장합니다.
 * - 앱 진입 시 `TermsProvider`와 결합하여 약관 미동의 사용자의 서비스 접근을 제한하는 가드 역할을 수행합니다.
 * - 세션 만료나 로그아웃 시 모든 상태를 초기화하여 보안 정합성을 유지합니다.
 *
 * @example
 * ```ts
 * const { isLoggedIn, termsAgreed, login } = useAgreeStore();
 *
 * // 로그인 성공 시 (약관 동의 여부 포함)
 * login(res.result.termsAgreed);
 *
 * // 약관 동의 완료 시
 * setAgreed();
 *
 * // 로그아웃 시
 * logout();
 * ```
 */

interface AuthState {
  isLoggedIn: boolean;
  termsAgreed: boolean;
  login: (agreed: boolean) => void;
  logout: () => void;
  setAgreed: () => void;
}

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
