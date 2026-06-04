"use client";

import { useEffect, useState } from "react";

const readNotificationPermission = (): NotificationPermission | undefined => {
  if (typeof Notification === "undefined") return undefined;
  return Notification.permission;
};

/**
 * 브라우저 알림 권한 상태를 반환합니다. Permissions API가 있으면 변경 시 갱신합니다.
 */
export const useBrowserNotificationPermission = (): NotificationPermission | undefined => {
  const [permission, setPermission] = useState(readNotificationPermission);

  useEffect(() => {
    const syncPermission = () => setPermission(readNotificationPermission());
    syncPermission();

    if (!navigator.permissions?.query) return;

    let permissionStatus: PermissionStatus | null = null;

    const handlePermissionChange = () => syncPermission();

    void navigator.permissions
      .query({ name: "notifications" as PermissionName })
      .then((status) => {
        permissionStatus = status;
        status.addEventListener("change", handlePermissionChange);
        syncPermission();
      })
      .catch(() => {});

    return () => {
      permissionStatus?.removeEventListener("change", handlePermissionChange);
    };
  }, []);

  return permission;
};
