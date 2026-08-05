import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import { getDateKey } from "@/utils";

export interface ChatMessageWithMetadata {
  chat: ChatMessage;
  isNewDate: boolean;
  nextSender?: "me" | "other";
  lastChat: boolean;
}

export const enrichMessages = (
  chatMessages: ChatMessage[],
  userId?: number
): ChatMessageWithMetadata[] => {
  return chatMessages.map((chat, i) => {
    const prevChat = chatMessages[i - 1];
    const isNewDate = i === 0 || getDateKey(chat.createdAt) !== getDateKey(prevChat.createdAt);
    const nextSender = prevChat ? (userId === prevChat.senderId ? "me" : "other") : undefined;

    return {
      chat,
      isNewDate,
      nextSender,
      lastChat: i === chatMessages.length - 1,
    };
  });
};
