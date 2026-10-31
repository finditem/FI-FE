import { AUTH_TOKEN_REFRESHED_EVENT } from "@/constants/AUTH_EVENTS";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { isSessionTerminal, refreshSession } from "@/api/_base/auth/authSession";
import { retryBackoffController } from "@/utils";

export type MessageHandler<T = any> = (message: T) => void;

let client: Client | null = null;
const subscriptions = new Map<string, StompSubscription>();
const handlers = new Map<string, Set<MessageHandler>>();

let pendingSubscriptions: Array<() => void> = [];
const savedSubscriptions = new Map<string, Set<MessageHandler>>();

let isReconnecting = false;
const RECONNECT_BASE_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 30000;
const RECONNECT_JITTER_RATIO = 0.2;
const reconnectRetryController = retryBackoffController({
  baseDelayMs: RECONNECT_BASE_DELAY_MS,
  maxDelayMs: RECONNECT_MAX_DELAY_MS,
  jitterRatio: RECONNECT_JITTER_RATIO,
});

let tokenRefreshHandler: (() => void) | null = null;

const REMOTE_CHAT_BROKER_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/^http/, "ws")}/ws`
  : "";

const toSameOriginWsBrokerUrl = (location: Pick<Location, "protocol" | "host">) => {
  const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${location.host}/api/ws`;
};

const getChatSocketBrokerURL = (): string => {
  if (typeof window === "undefined") return REMOTE_CHAT_BROKER_URL;

  const { hostname } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (process.env.NODE_ENV !== "production" || isLocal) {
    return toSameOriginWsBrokerUrl(window.location);
  }

  return REMOTE_CHAT_BROKER_URL;
};

let isAuthInvalid = false;

const refreshBeforeReconnect = async (): Promise<boolean> => {
  try {
    await refreshSession();
    console.log("[STOMP] Token refreshed before reconnecting");
    return true;
  } catch (refreshError) {
    console.warn(
      "[STOMP] Token refresh failed. Only invalid sessions stop reconnecting:",
      refreshError
    );
    if (isSessionTerminal()) {
      isAuthInvalid = true;
      disconnectChatSocket();
      return false;
    }
    // 현재 백오프 작업의 finally가 실행 상태를 해제한 다음 다시 예약합니다.
    setTimeout(() => scheduleReconnectChatSocket(), 0);
    return false;
  }
};

const restoreSavedSubscriptions = (): void => {
  savedSubscriptions.forEach((handlerSet, destination) => {
    handlerSet.forEach((handler) => subscribeChatSocket(destination, handler));
  });
  savedSubscriptions.clear();
};

const performReconnectChatSocket = async () => {
  if (isReconnecting) return;
  if (isAuthInvalid) return;
  isReconnecting = true;

  try {
    handlers.forEach((handlerSet, destination) => {
      savedSubscriptions.set(destination, new Set(handlerSet));
    });

    subscriptions.forEach((subscription) => subscription.unsubscribe());
    subscriptions.clear();

    if (client) {
      await client.deactivate();
      client = null;
    }

    const didRefresh = await refreshBeforeReconnect();
    if (!didRefresh) return;

    connectChatSocket();
  } catch {
    // 다음 연결 요청을 허용하도록 진행 상태를 finally에서 해제합니다.
  } finally {
    isReconnecting = false;
  }
};

const scheduleReconnectChatSocket = ({
  immediate = false,
  resetAttempt = false,
}: {
  immediate?: boolean;
  resetAttempt?: boolean;
} = {}) => {
  if (client?.connected) return;
  if (client?.active) return;
  if (handlers.size === 0) return;
  if (isAuthInvalid) return;
  if (isReconnecting) return;

  reconnectRetryController.schedule(performReconnectChatSocket, { immediate, resetAttempt });
};

export const connectChatSocket = () => {
  if (client?.connected) return;

  if (client && !client.connected) {
    client.deactivate();
    client = null;
  }

  // 성공적으로 연결할 것이므로 재시도 상태(백오프/대기 타이머)를 초기화합니다.
  reconnectRetryController.reset();

  client = new Client({
    brokerURL: getChatSocketBrokerURL(),
    reconnectDelay: 0,

    debug: (message) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[STOMP]", message);
      }
    },

    onConnect: () => {
      console.log("[STOMP] connected");
      isReconnecting = false;
      isAuthInvalid = false;
      reconnectRetryController.reset();

      pendingSubscriptions.forEach((subscribe) => subscribe());
      pendingSubscriptions = [];

      restoreSavedSubscriptions();
    },

    onStompError: (frame) => {
      const errorMessage = frame.headers["message"] || "";
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("403") ||
        errorMessage.includes("Unauthorized")
      ) {
        console.log("[STOMP] Authentication error detected, reconnecting...");
        scheduleReconnectChatSocket({ immediate: true, resetAttempt: true });
      }
    },

    onDisconnect: () => {
      console.log("[STOMP] disconnected");
      if (client && !client.connected && handlers.size > 0) {
        scheduleReconnectChatSocket();
      }
    },

    onWebSocketError: () => {
      if (client && !client.connected && handlers.size > 0) {
        scheduleReconnectChatSocket();
      }
    },
  });

  if (typeof window !== "undefined") {
    if (tokenRefreshHandler) {
      window.removeEventListener(AUTH_TOKEN_REFRESHED_EVENT, tokenRefreshHandler);
    }

    tokenRefreshHandler = () => {
      console.log("[STOMP] Token refreshed event received, reconnecting...");
      scheduleReconnectChatSocket({ immediate: true, resetAttempt: true });
    };

    window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, tokenRefreshHandler);
  }

  client.activate();
};

export const disconnectChatSocket = () => {
  subscriptions.forEach((subscription) => subscription.unsubscribe());
  subscriptions.clear();
  handlers.clear();
  savedSubscriptions.clear();

  pendingSubscriptions = [];
  isReconnecting = false;
  reconnectRetryController.cancel();

  if (typeof window !== "undefined" && tokenRefreshHandler) {
    window.removeEventListener(AUTH_TOKEN_REFRESHED_EVENT, tokenRefreshHandler);
    tokenRefreshHandler = null;
  }

  client?.deactivate();
  client = null;
};

export const subscribeChatSocket = <T>(destination: string, handler: MessageHandler<T>) => {
  const subscribe = () => {
    if (!client) return;

    if (!handlers.has(destination)) {
      handlers.set(destination, new Set());
    }
    handlers.get(destination)!.add(handler);

    if (subscriptions.has(destination)) {
      return;
    }

    const subscription = client.subscribe(destination, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        handlers.get(destination)?.forEach((handler) => handler(parsedMessage));
      } catch {}
    });

    subscriptions.set(destination, subscription);
  };

  if (!client?.connected) {
    pendingSubscriptions.push(subscribe);
    return;
  }

  subscribe();
};

export const unsubscribeChatSocket = (destination: string, handler: MessageHandler) => {
  handlers.get(destination)?.delete(handler);
  savedSubscriptions.get(destination)?.delete(handler);
  if (handlers.get(destination)?.size === 0) {
    const subscription = subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptions.delete(destination);
      handlers.delete(destination);
      savedSubscriptions.delete(destination);
    }
  }
};

export const sendChatSocketMessage = (destination: string, body: unknown): boolean => {
  if (!client?.connected) {
    return false;
  }

  try {
    client.publish({
      destination,
      body: JSON.stringify(body),
    });
    return true;
  } catch {
    return false;
  }
};
