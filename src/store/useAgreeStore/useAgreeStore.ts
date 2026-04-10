import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      name: "auth-storage",
    }
  )
);
