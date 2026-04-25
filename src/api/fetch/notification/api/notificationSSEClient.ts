"use client";

import { retryBackoffController } from "@/utils/retryBackoffController/retryBackoffController";
import type { NotificationEventData } from "../types/notificationSSETypes";
import { RELEASE_HOSTNAME } from "@/constants/RELEASE_HOSTNAME";

const ACCESS_TOKEN_API_PATH = "/api/auth/access-token";
const DEV_SSE_ACCESS_TOKEN_QUERY_KEY = "token";

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
  const g = globalThis as typeof globalThis & { [RUNTIME_KEY]?: SSERuntime };
  if (!g[RUNTIME_KEY]) {
    g[RUNTIME_KEY] = {
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
  return g[RUNTIME_KEY];
}

export function setNotificationSSEHandlers(next: Partial<Handlers>) {
  Object.assign(handlers, next);
}

async function buildSubscribeUrl(): Promise<{ url: string; accessToken: string } | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiBase) return null;

  const subscribeUrl = `${apiBase}/notifications/subscribe`;
  const rt = getRuntime();

  try {
    const res = await fetch(ACCESS_TOKEN_API_PATH, { cache: "no-store" });
    if (!res.ok) {
      rt.isAuthInvalid = true;
      return null;
    }

    const data = (await res.json()) as { accessToken: string | null };
    const token = data.accessToken ?? undefined;
    if (!token) {
      rt.isAuthInvalid = true;
      return null;
    }

    const q = new URLSearchParams();
    q.set(DEV_SSE_ACCESS_TOKEN_QUERY_KEY, token);
    const isReleaseHostname =
      typeof window !== "undefined" && window.location.hostname === RELEASE_HOSTNAME;
    const shouldSendTokenByQuery = process.env.NODE_ENV === "development" || isReleaseHostname;

    if (shouldSendTokenByQuery) {
      return {
        url: `${subscribeUrl}?${q.toString()}`,
        accessToken: token,
      };
    }

    return {
      url: subscribeUrl,
      accessToken: token,
    };
  } catch {
    rt.isAuthInvalid = true;
    return null;
  }
}

function release() {
  const rt = getRuntime();
  rt.connectionVersion += 1;
  if (rt.eventSource) {
    rt.eventSource.close();
    rt.eventSource = null;
  }
  handlers.onConnectionState?.(false);
}

function detachTokenRefreshListener() {
  if (typeof window === "undefined") return;
  const rt = getRuntime();
  if (!rt.tokenRefreshHandler) return;
  window.removeEventListener("tokenRefreshed", rt.tokenRefreshHandler);
  rt.tokenRefreshHandler = null;
}

function scheduleReconnectNotificationSSE({
  immediate = false,
  resetAttempt = false,
}: {
  immediate?: boolean;
  resetAttempt?: boolean;
} = {}) {
  const rt = getRuntime();
  if (!rt.shouldKeepAlive) return;
  if (rt.isAuthInvalid) return;
  if (rt.isReconnecting) return;
  if (rt.connectInFlight) return;

  reconnectRetryController.schedule(() => performReconnectNotificationSSE(), {
    immediate,
    resetAttempt,
  });
}

async function performReconnectNotificationSSE() {
  const rt = getRuntime();
  if (!rt.shouldKeepAlive) return;
  if (rt.isAuthInvalid) return;
  if (rt.isReconnecting) return;
  rt.isReconnecting = true;

  try {
    release();
    await connectNotificationSSE({ force: true });
    rt.consecutiveAuthRefreshFailures = 0;
    rt.isAuthInvalid = false;
  } finally {
    rt.isReconnecting = false;
  }
}

export function disconnectNotificationSSE() {
  const rt = getRuntime();
  rt.connectInFlight = false;
  rt.shouldKeepAlive = false;
  rt.isReconnecting = false;
  rt.isAuthInvalid = false;
  rt.consecutiveAuthRefreshFailures = 0;
  rt.currentAccessToken = null;
  rt.consecutiveSSEErrorCount = 0;
  reconnectRetryController.cancel();
  detachTokenRefreshListener();
  release();
}

export async function connectNotificationSSE(options?: { force?: boolean }): Promise<void> {
  if (typeof window === "undefined") return;

  const rt = getRuntime();
  const force = options?.force === true;

  if (!force) {
    if (rt.eventSource?.readyState === EventSource.OPEN) return;
    if (rt.eventSource?.readyState === EventSource.CONNECTING) return;
    if (rt.connectInFlight) return;
    if (rt.isReconnecting) return;
    if (rt.isAuthInvalid) return;
  }

  rt.shouldKeepAlive = true;
  rt.connectInFlight = true;

  try {
    release();

    const version = rt.connectionVersion;

    const connectionInfo = await buildSubscribeUrl();
    if (!connectionInfo) return;

    if (rt.connectionVersion !== version) return;

    if (rt.currentAccessToken !== connectionInfo.accessToken) {
      rt.currentAccessToken = connectionInfo.accessToken;
      rt.consecutiveSSEErrorCount = 0;
    }

    const es = new EventSource(connectionInfo.url, { withCredentials: true });

    if (rt.connectionVersion !== version) {
      es.close();
      return;
    }

    rt.eventSource = es;
    rt.isAuthInvalid = false;
    rt.consecutiveAuthRefreshFailures = 0;

    reconnectRetryController.reset();

    if (typeof window !== "undefined") {
      if (rt.tokenRefreshHandler) {
        window.removeEventListener("tokenRefreshed", rt.tokenRefreshHandler);
      }

      rt.tokenRefreshHandler = () => {
        rt.isAuthInvalid = false;
        rt.consecutiveSSEErrorCount = 0;
        scheduleReconnectNotificationSSE({ immediate: true, resetAttempt: true });
      };

      window.addEventListener("tokenRefreshed", rt.tokenRefreshHandler);
    }

    es.onopen = () => {
      if (rt.connectionVersion !== version || rt.eventSource !== es) return;
      handlers.onConnectionState?.(true);
      rt.consecutiveSSEErrorCount = 0;
      reconnectRetryController.reset();
    };

    es.addEventListener("connect", (e: MessageEvent) => {
      if (rt.connectionVersion !== version || rt.eventSource !== es) return;
      handlers.onConnectionState?.(true);
      handlers.onConnect?.(typeof e.data === "string" ? e.data : "");
      rt.consecutiveSSEErrorCount = 0;
      reconnectRetryController.reset();
    });

    es.addEventListener("notification", (e: MessageEvent) => {
      if (rt.connectionVersion !== version || rt.eventSource !== es) return;
      const data = JSON.parse(e.data) as NotificationEventData;
      handlers.onNotification?.(data);
    });

    es.onerror = () => {
      if (rt.connectionVersion !== version || rt.eventSource !== es) return;
      handlers.onConnectionState?.(false);
      // 브라우저 EventSource 자동 재연결 루프를 차단한다.
      es.close();
      rt.eventSource = null;
      rt.consecutiveSSEErrorCount += 1;

      if (rt.consecutiveSSEErrorCount >= MAX_SSE_ERROR_RETRY_PER_TOKEN) {
        rt.isAuthInvalid = true;
        return;
      }

      scheduleReconnectNotificationSSE();
    };
  } finally {
    rt.connectInFlight = false;
  }
}
