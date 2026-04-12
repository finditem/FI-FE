"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApiRefreshToken } from "@/api/fetch/auth";
import { useAgreeStore, useAuthStore } from "@/store";

export default function AuthBootstrap() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAgreeStore();

  const { mutate: refreshTokenMutate } = useApiRefreshToken();
  const ranRef = useRef(false);

  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  const isMainPage = pathname === "/";
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/sign-up");
  const isProtectPath =
    pathname.startsWith("/mypage/") ||
    pathname.startsWith("/write") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/change-password");

  useEffect(() => {
    if (isAuthPage) {
      setAuthInitialized(true);
      return;
    }

    if (!isMainPage && !isProtectPath) {
      setAuthInitialized(true);
      return;
    }

    if (ranRef.current) return;
    ranRef.current = true;

    refreshTokenMutate(undefined, {
      onSuccess: (data) => {
        if (data?.result?.temporaryPassword) {
          router.replace("/change-password?reason=temporary-password");
        }
      },
      onError: (error) => {
        logout();
        if (error.code === "AUTH401-INVALID_REFRESH" && isProtectPath) {
          router.replace("/login?reason=session-expired");
        }
      },
      onSettled: () => {
        setAuthInitialized(true);
      },
    });
  }, [refreshTokenMutate, router, pathname, setAuthInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentCount = parseInt(sessionStorage.getItem("__fmi_history_count") || "0", 10);
      if (currentCount < 2) {
        sessionStorage.setItem("__fmi_history_count", (currentCount + 1).toString());
      }
    }
  }, [pathname]);

  return null;
}
