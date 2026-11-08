"use client";

import { ReactNode } from "react";
import { useChatSocket } from "@/api/fetch/chatRoom/api/useChatSocket";

const ChatLayoutClient = ({ children }: { children: ReactNode }) => {
  useChatSocket({ manageConnection: true });
  return children;
};

export default ChatLayoutClient;
