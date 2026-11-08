import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useChatSocket } from "@/api/fetch/chatRoom";
import { WebSocketChatMessage } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ChatMessageResponse } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import {
  addMessageToCache,
  replaceMessageInCache,
} from "../../_utils/chatMessageCache/chatMessageCache";
import transformWebSocketMessage from "../../_utils/transformWebSocketMessage/transformWebSocketMessage";
import findOptimisticMessage from "../../_utils/findOptimisticMessage/findOptimisticMessage";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import useReadMessage from "@/api/fetch/chatMessage/api/useReadMessage";

const useChatSocketMessage = (roomId: number, currentUserId?: number) => {
  const queryClient = useQueryClient();
  const { mutate: readMessage } = useReadMessage(roomId);

  useChatSocket({
    onListUpdate: () => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
    },
    onMessage: (message: WebSocketChatMessage) => {
      if (!roomId) return;

      // 메시지의 roomId와 현재 roomId가 일치하는지 확인
      if (message.roomId !== roomId) return;

      // 상대방이 보낸 새 메시지일 때만 읽음 처리 (본인 메시지는 제외)
      // currentUserId가 없으면 수신 메시지마다 읽음 호출 (초기 로딩 시 누락 방지)
      const isFromOpponent = currentUserId == null || message.senderId !== currentUserId;
      if (isFromOpponent) {
        readMessage(undefined);
      }

      const oldData = queryClient.getQueryData<
        InfiniteData<ApiBaseResponseType<ChatMessageResponse>>
      >(["chatMessages", roomId]);

      const firstPage = oldData?.pages[0];

      // 쿼리 데이터가 아직 로드되지 않았을 때는 쿼리 무효화로 새로고침
      if (!firstPage) {
        queryClient.invalidateQueries({ queryKey: ["chatMessages", roomId] });
        return;
      }

      const chatMessage = transformWebSocketMessage(message);
      const optimisticMessage = findOptimisticMessage(firstPage.result.messages, message);

      if (optimisticMessage) {
        replaceMessageInCache(queryClient, roomId, optimisticMessage.messageId, chatMessage);
      } else {
        const messageExists = firstPage.result.messages.some(
          (m: ChatMessage) => m.messageId === message.messageId
        );
        if (!messageExists) {
          addMessageToCache(queryClient, roomId, chatMessage);
        }
      }
    },
  });
};

export default useChatSocketMessage;
