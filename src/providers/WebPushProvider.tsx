"use client";

import { type PropsWithChildren, useEffect } from "react";
import { useGetNotificationSetting } from "@/api/fetch/notification";
import { useAgreeStore, useAuthStore } from "@/store";
import { isWebPushSupported, registerWebPushServiceWorker, syncWebPushSubscription } from "@/utils";

/**
 * 브라우저 웹 푸시 서비스워커 등록과, 로그인 사용자의 구독 상태를 서버와 맞춥니다.
 *
 * @remarks
 * - 마운트 시 한 번 `registerWebPushServiceWorker`를 호출합니다.
 * - 약관 로그인·`authenticated` 상태·알림 설정에서 브라우저 푸시가 켜짐·`Notification.permission === "granted"`·`isWebPushSupported()`일 때만 `syncWebPushSubscription`을 시도합니다.
 * - 개발 환경에서 동기화 실패는 `console.warn`으로만 남깁니다.
 *
 * @author hyungjun
 
/**
 * @example
 * ```tsx
 * <WebPushProvider>{children}</WebPushProvider>
 * ```
 * @author suhyeon
 */

export const WebPushProvider = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useAgreeStore((state) => state.isLoggedIn);
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

  const { data: notificationSetting } = useGetNotificationSetting({
    enabled: isLoggedIn && isAuthenticated,
  });

  useEffect(() => {
    void registerWebPushServiceWorker();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isAuthenticated) return;

    const browserPushOn = notificationSetting?.result?.browserNotificationEnabled;
    if (!browserPushOn) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if (!isWebPushSupported()) return;

    void syncWebPushSubscription().catch((error: unknown) => {
      if (process.env.NODE_ENV !== "development") return;
      console.warn("[WebPushProvider] syncWebPushSubscription:", error);
    });
  }, [isLoggedIn, isAuthenticated, notificationSetting?.result?.browserNotificationEnabled]);

  return children;
};
