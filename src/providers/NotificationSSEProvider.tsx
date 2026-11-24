"use client";

import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { debounce } from "es-toolkit/compat";
import {
  NotificationEventData,
  NotificationUnreadListResult,
  NOTIFICATION_TYPE,
  REFERENCE_TYPE,
  useNotificationSSE,
  useNotificationUnreadList,
} from "@/api/fetch/notification";
import { useFaviconNotification } from "@/hooks";
import { getNotificationToastSeenAt, saveNotificationToastSeenAt } from "@/utils";
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
 * - 안 읽음 점(`hasUnreadNotification`·`unreadNotificationTypes`)은 `useNotificationUnreadList` 조회 결과를 기준으로 맞추고, SSE 이벤트는 다음 조회 전까지 점을 먼저 켭니다. `useFaviconNotification`으로 탭 표시도 맞춥니다.
 * - `connect` 이벤트마다 안 읽은 알림을 다시 조회합니다. 조회가 끝나기 전에 온 알림은 서버 재전송분일 수 있어 토스트 없이 점만 켭니다.
 * - 조회로 이미 아는 알림과 `notificationId`·`createdAt`이 같은 SSE 알림은 토스트를 띄우지 않습니다. 채팅 알림은 같은 번호로 `createdAt`만 바뀌어 오므로 새 알림으로 봅니다.
 * - 조회 결과에 마지막으로 토스트에 보여 준 시각보다 새 알림이 있으면 미확인 알림 요약 토스트를 띄웁니다. 새로고침·새 탭에서는 같은 알림으로 반복하지 않습니다.
 * - 로그인·회원가입 경로(`isAuthRoutePath`)에서는 스낵바 배치를 건너뜁니다.
 * - 채팅방에 있을 때 채팅 계열 알림이면 스낵바를 띄우지 않습니다. 지금 보고 있는 채팅방(`/chat/{referenceId}`)의 알림이면 점도 켜지 않습니다.
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
  const setUnreadNotificationTypes = useNotificationStore(
    (state) => state.setUnreadNotificationTypes
  );
  const { data: unreadData, refetch: refetchUnread } = useNotificationUnreadList(isAuthenticated);

  // connect 직후 안 읽은 알림 조회가 끝나기 전에 온 알림은 서버 재전송분일 수 있어 토스트를 띄우지 않는다.
  const isSyncingUnreadRef = useRef(false);
  const hasEventDuringSyncRef = useRef(false);
  // 조회로 이미 아는 안 읽은 알림의 notificationId별 createdAt. 둘 다 같으면 재전송분으로 본다.
  const knownUnreadRef = useRef(new Map<number, string>());

  const bufferedKeysRef = useRef<
    {
      notificationId: number;
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

  useEffect(() => {
    if (!unreadData) return;

    knownUnreadRef.current = new Map(
      unreadData.items.map(({ notificationId, createdAt }) => [notificationId, createdAt])
    );
    const unreadTypes = Array.from(new Set(unreadData.items.map(({ type }) => type)));
    setUnreadNotificationTypes(unreadTypes);
    setHasUnreadNotification(unreadTypes.length > 0);
  }, [unreadData, setHasUnreadNotification, setUnreadNotificationTypes]);

  const showUnreadSummary = ({ items, hasNext }: NotificationUnreadListResult) => {
    if (items.length === 0 || isAuthRoutePath(pathname)) return;

    const seenAt = getNotificationToastSeenAt() ?? 0;
    const hasUnseen = items.some(({ createdAt }) => !(Date.parse(createdAt) <= seenAt));
    if (!hasUnseen) return;

    items.forEach(({ createdAt }) => saveNotificationToastSeenAt(createdAt));
    showSnackBar(
      t(hasNext ? "unreadNotificationsMore" : "unreadNotifications", { count: items.length }),
      t("goToAlertPage"),
      () => router.push("/alert")
    );
  };

  const handleConnect = async () => {
    isSyncingUnreadRef.current = true;
    hasEventDuringSyncRef.current = false;
    const { data, isSuccess } = await refetchUnread();
    isSyncingUnreadRef.current = false;

    // 조회 중에 온 알림이 조회 결과에 빠졌을 수 있어 한 번 더 맞춘다.
    if (hasEventDuringSyncRef.current) {
      queryClient.invalidateQueries({ queryKey: ["notificationList"] });
    }
    if (isSuccess && data) {
      showUnreadSummary(data);
    }
  };

  const onNotification = useCallback(
    ({
      notificationId,
      type,
      referenceType,
      referenceId,
      title,
      createdAt,
    }: NotificationEventData) => {
      // 채팅 알림의 referenceId는 게시글 ID라 채팅방 경로(/chat/{postId})와 비교한다.
      // 보고 있는 방의 알림은 입장·수신 시 읽음 처리되므로 점을 켜지 않는다.
      const isViewingChatRoom =
        referenceType === REFERENCE_TYPE.CHAT && pathname === `/chat/${referenceId}`;
      if (!isViewingChatRoom) {
        setHasUnreadNotification(true);
        addUnreadNotificationType(type);
      }

      if (isSyncingUnreadRef.current) {
        hasEventDuringSyncRef.current = true;
        return;
      }
      if (knownUnreadRef.current.get(notificationId) === createdAt) {
        return;
      }
      knownUnreadRef.current.set(notificationId, createdAt);

      if (isAuthRoutePath(pathname)) {
        return;
      }
      saveNotificationToastSeenAt(createdAt);

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

      // 같은 번호가 배치 안에 다시 오면 최신 내용 한 건으로 센다.
      bufferedKeysRef.current = [
        ...bufferedKeysRef.current.filter((buffered) => buffered.notificationId !== notificationId),
        { notificationId, type, referenceType, title },
      ];

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
    onConnect: () => void handleConnect(),
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
