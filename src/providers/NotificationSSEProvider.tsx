"use client";

import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { debounce } from "es-toolkit/compat";
import {
  NotificationEventData,
  NOTIFICATION_TYPE,
  REFERENCE_TYPE,
  useNotificationSSE,
} from "@/api/fetch/notification";
import { useFaviconNotification } from "@/hooks";
import { useSnackBar } from "@/context/SnackBarContext";
import { useAuthStore, useNotificationStore } from "@/store";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants";
import { usePathname, useRouter } from "@/i18n/navigation";

const isAuthRoutePath = (pathname: string) =>
  pathname.startsWith("/login") || pathname.startsWith("/sign-up");

const NOTIFICATION_BATCH_DEBOUNCE_MS = 500;

/**
 * 알림 SSE 연결과 수신 이벤트에 따른 캐시 무효화·스낵바·파비콘 배지를 묶은 프로바이더입니다.
 *
 * @remarks
 * - `useNotificationSSE`는 `authenticated` 상태일 때만 연결합니다.
 * - 이벤트마다 `hasUnreadNotification`·`unreadNotificationTypes`를 갱신하고, `useFaviconNotification`으로 탭 표시를 맞춥니다.
 * - 로그인·회원가입 경로(`isAuthRoutePath`)에서는 스낵바 배치를 건너뜁니다.
 * - 채팅방에 있을 때 채팅 계열 알림이면 스낵바를 띄우지 않습니다.
 * - 그 외에는 이벤트를 버퍼에 쌓고 파일 상수(ms)만큼 `debounce`한 뒤 `notificationList` 무효화와 스낵바(단건 제목 vs N건 요약)를 한 번에 처리합니다.
 * - 인증 경로에서 벗어날 때·`AUTH_LOGIN_SUCCESS_EVENT`·보류 플래그가 있을 때 `connect`로 재연결을 시도합니다.
 * - 언마운트 시 디바운스 `cancel`로 예약된 플러시를 막습니다.
 *
 * @author hyungjun
 
/**
 * @example
 * ```tsx
 * <NotificationSSEProvider>{children}</NotificationSSEProvider>
 * ```
 * @author suhyeon
 */

export const NotificationSSEProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { showSnackBar } = useSnackBar();
  const t = useTranslations("NotificationSSEProvider");
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");
  const hasUnreadNotification = useNotificationStore((state) => state.hasUnreadNotification);
  const setHasUnreadNotification = useNotificationStore((state) => state.setHasUnreadNotification);

  useFaviconNotification(hasUnreadNotification);
  const addUnreadNotificationType = useNotificationStore(
    (state) => state.addUnreadNotificationType
  );

  const bufferedKeysRef = useRef<
    {
      type: NotificationEventData["type"];
      referenceType: NotificationEventData["referenceType"];
      title: string;
    }[]
  >([]);

  // debounce의 cancel·flush가 같은 타이머를 제어하도록 외부 라이브러리 인스턴스를 유지합니다.
  const debouncedFlush = useMemo(
    () =>
      debounce(() => {
        const buffered = bufferedKeysRef.current;
        bufferedKeysRef.current = [];
        if (buffered.length === 0) return;

        queryClient.invalidateQueries({ queryKey: ["notificationList"] });

        const title =
          buffered.length === 1
            ? buffered[0].title
            : t("newNotifications", { count: buffered.length });

        showSnackBar(title, t("goToAlertPage"), () => router.push("/alert"));
      }, NOTIFICATION_BATCH_DEBOUNCE_MS),
    [queryClient, router, showSnackBar, t]
  );

  useEffect(() => {
    return () => {
      debouncedFlush.cancel();
    };
  }, [debouncedFlush]);

  useEffect(() => {
    if (!isAuthenticated) {
      bufferedKeysRef.current = [];
      debouncedFlush.cancel();
    }
  }, [isAuthenticated, debouncedFlush]);

  const onNotification = useCallback(
    ({ type, referenceType, title }: NotificationEventData) => {
      setHasUnreadNotification(true);
      addUnreadNotificationType(type);

      if (isAuthRoutePath(pathname)) {
        return;
      }

      // 후기 도착은 배치 요약 없이 전용 문구·이동 경로로 즉시 노출한다.
      if (type === NOTIFICATION_TYPE.REVIEW) {
        debouncedFlush.flush();
        queryClient.invalidateQueries({ queryKey: ["notificationList"] });
        queryClient.invalidateQueries({ queryKey: ["/users/me/reviews"] });
        showSnackBar(t("reviewArrived"), t("goToReviewPage"), () => router.push("/mypage/reviews"));
        return;
      }

      const isChatPage = pathname.startsWith("/chat");
      const isChatNotification =
        type === NOTIFICATION_TYPE.CHAT ||
        type === NOTIFICATION_TYPE.CHAT_REMINDER ||
        referenceType === REFERENCE_TYPE.CHAT;

      if (isChatPage && isChatNotification) {
        return;
      }

      bufferedKeysRef.current.push({
        type,
        referenceType,
        title,
      });

      debouncedFlush();
    },
    [
      pathname,
      debouncedFlush,
      setHasUnreadNotification,
      addUnreadNotificationType,
      queryClient,
      showSnackBar,
      t,
      router,
    ]
  );

  const prevPathnameRef = useRef(pathname);
  const hasPendingSSEReconnectRef = useRef(false);

  const { connect } = useNotificationSSE({
    enabled: isAuthenticated,
    onNotification,
  });

  const requestSSEReconnect = useCallback(() => {
    hasPendingSSEReconnectRef.current = true;
    if (!isAuthenticated) return;

    connect();
    hasPendingSSEReconnectRef.current = false;
  }, [isAuthenticated, connect]);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    const didMove = isAuthRoutePath(prevPathname) && !isAuthRoutePath(pathname);

    if (didMove) {
      requestSSEReconnect();
    }

    prevPathnameRef.current = pathname;
  }, [pathname, requestSSEReconnect]);

  useEffect(() => {
    const handleLoginSuccess = () => {
      requestSSEReconnect();
    };

    window.addEventListener(AUTH_LOGIN_SUCCESS_EVENT, handleLoginSuccess);
    return () => {
      window.removeEventListener(AUTH_LOGIN_SUCCESS_EVENT, handleLoginSuccess);
    };
  }, [requestSSEReconnect]);

  useEffect(() => {
    if (!hasPendingSSEReconnectRef.current) return;
    requestSSEReconnect();
  }, [requestSSEReconnect]);

  return children;
};
