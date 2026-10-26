"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAgreeStore, useAuthStore } from "@/store";

export const TermsProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, termsAgreed } = useAgreeStore();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

  useEffect(() => {
    if (!isAuthInitialized || !isAuthenticated) return;

    if (isLoggedIn && !termsAgreed) {
      if (!pathname.startsWith("/auth/kakao") && !pathname.startsWith("/auth/apple")) {
        router.replace("/auth/kakao/callback");
      }
    }
  }, [isAuthInitialized, isAuthenticated, isLoggedIn, termsAgreed, pathname, router]);

  return <>{children}</>;
};
