"use client";

import { useEffect } from "react";
import type { MessageHandler } from "./chatSocket";
import { ChatListUpdateResponse, WebSocketChatMessage } from "../types/ChatRoomResponse";

interface UseChatSocketOptions {
  onMessage?: (data: WebSocketChatMessage) => void;
  onListUpdate?: (data: ChatListUpdateResponse) => void;
  manageConnection?: boolean;
}

const scheduleDeferredConnect = (task: () => void) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(task);
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = setTimeout(task, 0);
  return () => clearTimeout(timeoutId);
};

export const useChatSocket = ({
  onMessage,
  onListUpdate,
  manageConnection = false,
}: UseChatSocketOptions = {}) => {
  useEffect(() => {
    let cancelled = false;
    let cancelDeferredConnect: (() => void) | undefined;
    let chatSocketModule: typeof import("./chatSocket") | null = null;

    const subscriptions = [
      { destination: "/user/queue/messages", handler: onMessage },
      { destination: "/user/queue/list-updates", handler: onListUpdate },
    ];

    const init = async () => {
      chatSocketModule = await import("./chatSocket");
      if (cancelled) return;

      if (manageConnection) {
        cancelDeferredConnect = scheduleDeferredConnect(() => {
          if (!cancelled) {
            chatSocketModule?.connectChatSocket();
          }
        });
        return;
      }

      subscriptions.forEach(({ destination, handler }) => {
        if (handler) {
          chatSocketModule?.subscribeChatSocket(destination, handler as MessageHandler);
        }
      });
    };

    init();

    return () => {
      cancelled = true;
      cancelDeferredConnect?.();

      if (!chatSocketModule) return;

      if (manageConnection) {
        chatSocketModule.disconnectChatSocket();
        return;
      }

      subscriptions.forEach(({ destination, handler }) => {
        if (handler) {
          chatSocketModule?.unsubscribeChatSocket(destination, handler as MessageHandler);
        }
      });
    };
  }, [onMessage, onListUpdate, manageConnection]);
};
