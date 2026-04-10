"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAgreeStore } from "@/store";

export default function TermsProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, termsAgreed } = useAgreeStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoggedIn && !termsAgreed) {
      if (!pathname.startsWith("/auth/kakao")) {
        router.replace("/auth/kakao/callback");
      }
    }
  }, [isLoggedIn, termsAgreed, pathname, router]);

  return <>{children}</>;
}
