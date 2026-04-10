"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAgreeStore, useAuthStore } from "@/store";

export default function TermsProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, termsAgreed } = useAgreeStore();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  useEffect(() => {
    if (!isAuthInitialized) return;

    if (isLoggedIn && !termsAgreed) {
      if (!pathname.startsWith("/auth/kakao")) {
        router.replace("/auth/kakao/callback");
      }
    }
  }, [isAuthInitialized, isLoggedIn, termsAgreed, pathname, router]);

  return <>{children}</>;
}
