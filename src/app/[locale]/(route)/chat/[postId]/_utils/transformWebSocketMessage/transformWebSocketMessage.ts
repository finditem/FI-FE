import { WebSocketChatMessage } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";

const transformWebSocketMessage = (message: WebSocketChatMessage): ChatMessage => {
  const { roomId: _, ...chatMessageData } = message;
  return {
    ...chatMessageData,
    imageUrls: message.imageUrls || [],
  };
};

export default transformWebSocketMessage;
