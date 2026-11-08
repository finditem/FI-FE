"use client";

import axios from "axios";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  getSessionEpoch,
  isSessionTerminal,
  refreshSession,
  resetClientSession,
} from "@/api/_base/auth/authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { AUTH_SESSION_ENDED_EVENT } from "@/constants/AUTH_EVENTS";
import { isAuthRoute } from "@/utils/isAuthRoute/isAuthRoute";
import { disconnectChatSocket } from "@/api/fetch/chatRoom/api/chatSocket";
import { disconnectNotificationSSE } from "@/api/fetch/notification/api/notificationSSEClient";

interface AuthBootstrapProps {
  /**
   * 서버가 확인한 토큰 존재 여부이며 초기 확인의 힌트로만 사용합니다.
   * @author suhyeon
   */
  hasToken: boolean;
}

/**
 * 초기 인증 확인·통신 복구와 세션 종료 시 클라이언트 자원 정리를 담당합니다.
 * @remarks
 * 인증 경로에서 보류한 세션은 일반 화면에서 쿠키 힌트로 다시 확인합니다.
 * 종료가 확정된 세션은 재확인하지 않으며, 통신 장애에는 온라인·포커스 복귀 시 재시도합니다.
 * @param props - 서버가 확인한 토큰 존재 여부를 초기 힌트로 받습니다.
 * @author suhyeon
 * @example
 * <AuthBootstrap hasToken={hasToken} />
 */
export default function AuthBootstrap({ hasToken }: AuthBootstrapProps) {
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
    if (status === "authenticated" || isSessionTerminal() || (status === "anonymous" && !hasToken))
      return;
    if (isAuthRoute(pathname)) {
      setStatus("anonymous");
      return;
    }
    if (!hasToken) {
      resetClientSession();
      return;
    }
    setStatus("checking");
    const initializationSessionEpoch = getSessionEpoch();
    let isEffectActive = true;
    void refreshSession()
      .then((data) => {
        if (isEffectActive && data.result.temporaryPassword) {
          router.replace("/change-password?reason=temporary-password");
        }
      })
      .catch((error: unknown) => {
        if (!isEffectActive || initializationSessionEpoch !== getSessionEpoch()) return;
        if (axios.isCancel(error)) return;
        setStatus("unavailable");
      });
    return () => {
      isEffectActive = false;
    };
  }, [hasToken, pathname, router]);

  useEffect(() => {
    const recoverAuthentication = () => {
      if (useAuthStore.getState().status !== "unavailable" || isAuthRoute(pathname)) return;
      void refreshSession().catch(() => {});
    };
    window.addEventListener("online", recoverAuthentication);
    window.addEventListener("focus", recoverAuthentication);
    return () => {
      window.removeEventListener("online", recoverAuthentication);
      window.removeEventListener("focus", recoverAuthentication);
    };
  }, [pathname]);

  useEffect(() => {
    const currentCount = parseInt(sessionStorage.getItem("__fmi_history_count") || "0", 10);
    if (currentCount < 2)
      sessionStorage.setItem("__fmi_history_count", (currentCount + 1).toString());
  }, [pathname]);

  return null;
}
