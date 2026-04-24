"use client";

import { PropsWithChildren, useEffect } from "react";
import { useGetNotificationSetting } from "@/api/fetch/notification";
import { useAgreeStore, useAuthStore } from "@/store";
import { isWebPushSupported, registerWebPushServiceWorker, syncWebPushSubscription } from "@/utils";

export const WebPushProvider = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useAgreeStore((s) => s.isLoggedIn);
  const isAuthInitialized = useAuthStore((s) => s.isAuthInitialized);

  const { data: notificationSetting } = useGetNotificationSetting({
    enabled: isLoggedIn && isAuthInitialized,
  });

  useEffect(() => {
    void registerWebPushServiceWorker();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isAuthInitialized) return;

    const browserPushOn = notificationSetting?.result?.browserNotificationEnabled;
    if (!browserPushOn) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if (!isWebPushSupported()) return;

    void (async () => {
      try {
        await syncWebPushSubscription();
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[WebPushProvider] syncWebPushSubscription:", e);
        }
      }
    })();
  }, [isLoggedIn, isAuthInitialized, notificationSetting?.result?.browserNotificationEnabled]);

  return children;
};
