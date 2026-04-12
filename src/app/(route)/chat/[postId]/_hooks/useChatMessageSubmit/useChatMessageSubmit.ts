import { UseFormReset } from "react-hook-form";
import { sendChatSocketMessage } from "@/api/fetch/chatRoom";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import { addMessageToCache, removeMessageFromCache } from "../../_utils";
import { useQueryClient } from "@tanstack/react-query";

interface UseChatMessageSubmitParams {
  roomId: number;
  userId: number;
  reset: UseFormReset<{ content: string }>;
  onSendSuccess?: () => void;
}

const useChatMessageSubmit = ({
  roomId,
  userId,
  reset,
  onSendSuccess,
}: UseChatMessageSubmitParams) => {
  const queryClient = useQueryClient();

  const onSubmit = ({ content }: { content: string }) => {
    if (content.trim() === "" || !roomId || !userId || userId === 0) return;

    const optimisticId = -Date.now();
    const optimisticMessage: ChatMessage = {
      messageId: optimisticId,
      messageType: "TEXT",
      senderId: userId,
      content,
      imageUrls: [],
      createdAt: new Date().toISOString(),
    };

    addMessageToCache(queryClient, roomId, optimisticMessage);

    const sendSucceeded = sendChatSocketMessage(`/app/chats/${roomId}/send`, {
      content,
    });
    if (!sendSucceeded) {
      removeMessageFromCache(queryClient, roomId, optimisticId);
    } else {
      requestAnimationFrame(() => {
        onSendSuccess?.();
      });
    }

    reset();
  };

  return { onSubmit };
};

export default useChatMessageSubmit;
