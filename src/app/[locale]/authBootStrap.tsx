"use client";

import axios from "axios";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getSessionEpoch, refreshSession, resetClientSession } from "@/api/_base/auth/authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { AUTH_SESSION_ENDED_EVENT } from "@/constants/AUTH_EVENTS";
import { isAuthRoute } from "@/utils/authRoutes/authRoutes";
import { disconnectChatSocket } from "@/api/fetch/chatRoom/api/chatSocket";
import { disconnectNotificationSSE } from "@/api/fetch/notification/api/notificationSSEClient";

export default function AuthBootstrap({ hasToken }: { hasToken: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSessionEnded = () => {
      queryClient.clear();
      disconnectChatSocket();
      disconnectNotificationSSE();
    };
    window.addEventListener(AUTH_SESSION_ENDED_EVENT, handleSessionEnded);
    return () => window.removeEventListener(AUTH_SESSION_ENDED_EVENT, handleSessionEnded);
  }, [queryClient]);

  useEffect(() => {
    const { status, setStatus } = useAuthStore.getState();
    if (status === "authenticated" || status === "anonymous") return;
    if (isAuthRoute(pathname)) {
      setStatus("anonymous");
      return;
    }
    if (!hasToken) {
      resetClientSession();
      return;
    }
    const epoch = getSessionEpoch();
    let active = true;
    void refreshSession()
      .then((data) => {
        if (active && data.result.temporaryPassword) {
          router.replace("/change-password?reason=temporary-password");
        }
      })
      .catch((error: unknown) => {
        if (active && epoch === getSessionEpoch() && !axios.isCancel(error)) {
          setStatus("unavailable");
        }
      });
    return () => {
      active = false;
    };
  }, [hasToken, pathname, router]);

  useEffect(() => {
    const recover = () => {
      if (useAuthStore.getState().status !== "unavailable" || isAuthRoute(pathname)) return;
      void refreshSession().catch(() => {});
    };
    window.addEventListener("online", recover);
    window.addEventListener("focus", recover);
    return () => {
      window.removeEventListener("online", recover);
      window.removeEventListener("focus", recover);
    };
  }, [pathname]);

  useEffect(() => {
    const currentCount = parseInt(sessionStorage.getItem("__fmi_history_count") || "0", 10);
    if (currentCount < 2)
      sessionStorage.setItem("__fmi_history_count", (currentCount + 1).toString());
  }, [pathname]);

  return null;
}
