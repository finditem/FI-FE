"use client";

import { useEffect, useState } from "react";

const readNotificationPermission = (): NotificationPermission | undefined => {
  if (typeof Notification === "undefined") return undefined;
  return Notification.permission;
};

/**
 * 브라우저 알림(Notification) 권한 상태를 구독해 반환하는 훅입니다.
 *
 * 알림 설정 화면 등에서 `default`·`granted`·`denied` 상태를 UI에 반영할 때 사용합니다.
 *
 * @returns `Notification.permission` 값. SSR·미지원 환경이면 `undefined`
 *
 * @remarks
 * - 초기값은 `Notification.permission`으로 맞춥니다.
 * - `navigator.permissions.query({ name: "notifications" })`가 있으면 `change` 이벤트로 이후 변경을 반영합니다.
 * - `navigator.permissions`가 없으면 마운트 시 한 번만 동기화한 뒤 종료합니다.
 * - 비동기 `query` 완료 전 언마운트 시 리스너 등록·상태 갱신을 하지 않습니다.
 * - 마운트 해제 시 `change` 리스너를 제거합니다.
 *
 * @author hyungjun
 */

/**
 * @example
 * ```tsx
 * const permission = useBrowserNotificationPermission();
 * return permission === "granted" ? <EnabledLabel /> : <RequestPermissionButton />;
 * ```
 */

export const useBrowserNotificationPermission = (): NotificationPermission | undefined => {
  const [permission, setPermission] = useState(readNotificationPermission);

  useEffect(() => {
    let isMounted = true;
    let permissionStatus: PermissionStatus | null = null;

    const syncPermission = () => {
      if (isMounted) {
        setPermission(readNotificationPermission());
      }
    };

    syncPermission();

    if (!navigator.permissions?.query) return;

    const handlePermissionChange = () => syncPermission();

    void navigator.permissions
      .query({ name: "notifications" as PermissionName })
      .then((status) => {
        if (!isMounted) return;
        permissionStatus = status;
        status.addEventListener("change", handlePermissionChange);
        syncPermission();
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handlePermissionChange);
      }
    };
  }, []);

  return permission;
};
