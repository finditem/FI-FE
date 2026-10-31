"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAgreeStore, useAuthStore } from "@/store";

export const TermsProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, termsAgreed } = useAgreeStore();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!isLoggedIn || termsAgreed) return;
    if (pathname.startsWith("/auth/kakao") || pathname.startsWith("/auth/apple")) return;

    router.replace("/auth/kakao/callback");
  }, [isAuthenticated, isLoggedIn, termsAgreed, pathname, router]);

  return <>{children}</>;
};
