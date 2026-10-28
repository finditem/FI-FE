"use client";

import { AUTH_TOKEN_REFRESHED_EVENT } from "@/constants/AUTH_EVENTS";

import { retryBackoffController } from "@/utils/retryBackoffController/retryBackoffController";
import type { NotificationEventData } from "../types/notificationSSETypes";

const ACCESS_TOKEN_API_PATH = "/api/auth/access-token";
const SAME_ORIGIN_SSE_SUBSCRIBE_PATH = "/api/notifications/subscribe";

const REMOTE_SSE_SUBSCRIBE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/notifications/subscribe`
  : "";

const RUNTIME_KEY = "__fmi_notification_sse_runtime__";

type Handlers = {
  onNotification?: (data: NotificationEventData) => void;
  onConnect?: (message: string) => void;
  onConnectionState?: (connected: boolean) => void;
};

type SSERuntime = {
  eventSource: EventSource | null;
  connectionVersion: number;
  connectInFlight: boolean;
  shouldKeepAlive: boolean;
  isReconnecting: boolean;
  isAuthInvalid: boolean;
  consecutiveAuthRefreshFailures: number;
  tokenRefreshHandler: (() => void) | null;
  currentAccessToken: string | null;
  consecutiveSSEErrorCount: number;
};

const handlers: Handlers = {};
const RECONNECT_BASE_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 30000;
const RECONNECT_JITTER_RATIO = 0.2;
const MAX_SSE_ERROR_RETRY_PER_TOKEN = 3;
const reconnectRetryController = retryBackoffController({
  baseDelayMs: RECONNECT_BASE_DELAY_MS,
  maxDelayMs: RECONNECT_MAX_DELAY_MS,
  jitterRatio: RECONNECT_JITTER_RATIO,
});

function getRuntime(): SSERuntime {
  const globalRuntime = globalThis as typeof globalThis & { [RUNTIME_KEY]?: SSERuntime };
  if (!globalRuntime[RUNTIME_KEY]) {
    globalRuntime[RUNTIME_KEY] = {
      eventSource: null,
      connectionVersion: 0,
      connectInFlight: false,
      shouldKeepAlive: false,
      isReconnecting: false,
      isAuthInvalid: false,
      consecutiveAuthRefreshFailures: 0,
      tokenRefreshHandler: null,
      currentAccessToken: null,
      consecutiveSSEErrorCount: 0,
    };
  }
  return globalRuntime[RUNTIME_KEY];
}

/**
 * 기존 연결을 유지하면서 알림 이벤트의 처리 함수를 갱신합니다.
 * @param nextHandlers - 갱신할 이벤트 처리 함수만 지정합니다.
 *
 * @author suhyeon
 *
 * @example
 * setNotificationSSEHandlers({ onNotification: handleNotification });
 */
export function setNotificationSSEHandlers(nextHandlers: Partial<Handlers>) {
  Object.assign(handlers, nextHandlers);
}

const getNotificationSSESubscribeURL = (): string => {
  if (typeof window === "undefined") return REMOTE_SSE_SUBSCRIBE_URL;

  const { hostname } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (process.env.NODE_ENV !== "production" || isLocal) {
    return SAME_ORIGIN_SSE_SUBSCRIBE_PATH;
  }

  return REMOTE_SSE_SUBSCRIBE_URL;
};

async function buildSubscribeUrl(): Promise<{ url: string; accessToken: string } | null> {
  const subscribeUrl = getNotificationSSESubscribeURL();
  if (!subscribeUrl) return null;

  const runtime = getRuntime();

  try {
    const response = await fetch(ACCESS_TOKEN_API_PATH, { cache: "no-store" });
    if (!response.ok) {
      runtime.isAuthInvalid = true;
      return null;
    }

    const data = (await response.json()) as { accessToken: string | null };
    const token = data.accessToken ?? undefined;
    if (!token) {
      runtime.isAuthInvalid = true;
      return null;
    }

    return {
      url: subscribeUrl,
      accessToken: token,
    };
  } catch {
    runtime.isAuthInvalid = true;
    return null;
  }
}

function release() {
  const runtime = getRuntime();
  runtime.connectionVersion += 1;
  if (runtime.eventSource) {
    runtime.eventSource.close();
    runtime.eventSource = null;
  }
  handlers.onConnectionState?.(false);
}

function detachTokenRefreshListener() {
  if (typeof window === "undefined") return;
  const runtime = getRuntime();
  if (!runtime.tokenRefreshHandler) return;
  window.removeEventListener(AUTH_TOKEN_REFRESHED_EVENT, runtime.tokenRefreshHandler);
  runtime.tokenRefreshHandler = null;
}

function attachTokenRefreshListener(runtime: SSERuntime): void {
  if (typeof window === "undefined") return;
  detachTokenRefreshListener();
  runtime.tokenRefreshHandler = () => {
    runtime.isAuthInvalid = false;
    runtime.consecutiveSSEErrorCount = 0;
    scheduleReconnectNotificationSSE({ immediate: true, resetAttempt: true });
  };
  window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, runtime.tokenRefreshHandler);
}

function scheduleReconnectNotificationSSE({
  immediate = false,
  resetAttempt = false,
}: {
  immediate?: boolean;
  resetAttempt?: boolean;
} = {}) {
  const runtime = getRuntime();
  if (!runtime.shouldKeepAlive) return;
  if (runtime.isAuthInvalid) return;
  if (runtime.isReconnecting) return;
  if (runtime.connectInFlight) return;

  reconnectRetryController.schedule(() => performReconnectNotificationSSE(), {
    immediate,
    resetAttempt,
  });
}

async function performReconnectNotificationSSE() {
  const runtime = getRuntime();
  if (!runtime.shouldKeepAlive) return;
  if (runtime.isAuthInvalid) return;
  if (runtime.isReconnecting) return;
  runtime.isReconnecting = true;

  try {
    release();
    await connectNotificationSSE({ force: true });
    runtime.consecutiveAuthRefreshFailures = 0;
    runtime.isAuthInvalid = false;
  } finally {
    runtime.isReconnecting = false;
  }
}

/**
 * 알림 연결·재시도와 토큰 갱신 리스너를 함께 정리합니다.
 *
 * @author suhyeon
 *
 * @example
 * disconnectNotificationSSE();
 */
export function disconnectNotificationSSE() {
  const runtime = getRuntime();
  runtime.connectInFlight = false;
  runtime.shouldKeepAlive = false;
  runtime.isReconnecting = false;
  runtime.isAuthInvalid = false;
  runtime.consecutiveAuthRefreshFailures = 0;
  runtime.currentAccessToken = null;
  runtime.consecutiveSSEErrorCount = 0;
  reconnectRetryController.cancel();
  detachTokenRefreshListener();
  release();
}

interface ConnectNotificationSSEOptions {
  /**
   * 기존 연결을 교체할지 지정하며 기본값은 false입니다.
   * @author suhyeon
   */
  force?: boolean;
}

/**
 * 현재 토큰과 연결 세대를 확인한 뒤 알림 SSE를 연결합니다.
 * @param options - 로그인 완료·토큰 갱신 시 force로 연결 교체를 요청합니다.
 *
 * @author suhyeon
 *
 * @example
 * await connectNotificationSSE({ force: true });
 */
export async function connectNotificationSSE(
  options?: ConnectNotificationSSEOptions
): Promise<void> {
  if (typeof window === "undefined") return;

  const runtime = getRuntime();
  const force = options?.force === true;

  if (!force) {
    if (runtime.eventSource?.readyState === EventSource.OPEN) return;
    if (runtime.eventSource?.readyState === EventSource.CONNECTING) return;
    if (runtime.connectInFlight) return;
    if (runtime.isReconnecting) return;
    if (runtime.isAuthInvalid) return;
  }

  runtime.shouldKeepAlive = true;
  runtime.connectInFlight = true;

  try {
    release();

    const connectionVersion = runtime.connectionVersion;

    const connectionInfo = await buildSubscribeUrl();
    if (!connectionInfo) return;

    if (runtime.connectionVersion !== connectionVersion) return;

    if (runtime.currentAccessToken !== connectionInfo.accessToken) {
      runtime.currentAccessToken = connectionInfo.accessToken;
      runtime.consecutiveSSEErrorCount = 0;
    }

    const eventSource = new EventSource(connectionInfo.url, { withCredentials: true });

    if (runtime.connectionVersion !== connectionVersion) {
      eventSource.close();
      return;
    }

    runtime.eventSource = eventSource;
    runtime.isAuthInvalid = false;
    runtime.consecutiveAuthRefreshFailures = 0;

    reconnectRetryController.reset();

    attachTokenRefreshListener(runtime);

    eventSource.onopen = () => {
      if (runtime.connectionVersion !== connectionVersion || runtime.eventSource !== eventSource)
        return;
      handlers.onConnectionState?.(true);
      runtime.consecutiveSSEErrorCount = 0;
      reconnectRetryController.reset();
    };

    eventSource.addEventListener("connect", (event: MessageEvent) => {
      if (runtime.connectionVersion !== connectionVersion || runtime.eventSource !== eventSource)
        return;
      handlers.onConnectionState?.(true);
      handlers.onConnect?.(typeof event.data === "string" ? event.data : "");
      runtime.consecutiveSSEErrorCount = 0;
      reconnectRetryController.reset();
    });

    eventSource.addEventListener("notification", (event: MessageEvent) => {
      if (runtime.connectionVersion !== connectionVersion || runtime.eventSource !== eventSource)
        return;
      const data = JSON.parse(event.data) as NotificationEventData;
      handlers.onNotification?.(data);
    });

    eventSource.onerror = () => {
      if (runtime.connectionVersion !== connectionVersion || runtime.eventSource !== eventSource)
        return;
      handlers.onConnectionState?.(false);
      // 브라우저 EventSource 자동 재연결 루프를 차단한다.
      eventSource.close();
      runtime.eventSource = null;
      runtime.consecutiveSSEErrorCount += 1;

      if (runtime.consecutiveSSEErrorCount >= MAX_SSE_ERROR_RETRY_PER_TOKEN) {
        runtime.isAuthInvalid = true;
        return;
      }

      scheduleReconnectNotificationSSE();
    };
  } finally {
    runtime.connectInFlight = false;
  }
}
