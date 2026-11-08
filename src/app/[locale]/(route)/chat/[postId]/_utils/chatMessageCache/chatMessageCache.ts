import { QueryClient, InfiniteData } from "@tanstack/react-query";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ChatMessageResponse } from "@/api/fetch/chatMessage/types/ChatMessageResponse";

export const addMessageToCache = (
  queryClient: QueryClient,
  roomId: number,
  message: ChatMessage
) => {
  const oldData = queryClient.getQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>([
    "chatMessages",
    roomId,
  ]);

  if (!oldData?.pages[0]) return;

  const firstPage = oldData.pages[0];
  queryClient.setQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>(
    ["chatMessages", roomId],
    {
      ...oldData,
      pages: [
        {
          ...firstPage,
          result: {
            ...firstPage.result,
            messages: [message, ...firstPage.result.messages],
          },
        },
        ...oldData.pages.slice(1),
      ],
    }
  );
};

export const removeMessageFromCache = (
  queryClient: QueryClient,
  roomId: number,
  messageId: number
) => {
  const oldData = queryClient.getQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>([
    "chatMessages",
    roomId,
  ]);

  if (!oldData?.pages[0]) return;

  const firstPage = oldData.pages[0];
  const updatedMessages = firstPage.result.messages.filter((m) => m.messageId !== messageId);

  queryClient.setQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>(
    ["chatMessages", roomId],
    {
      ...oldData,
      pages: [
        {
          ...firstPage,
          result: {
            ...firstPage.result,
            messages: updatedMessages,
          },
        },
        ...oldData.pages.slice(1),
      ],
    }
  );
};

export const replaceMessageInCache = (
  queryClient: QueryClient,
  roomId: number,
  oldMessageId: number,
  newMessage: ChatMessage
) => {
  const oldData = queryClient.getQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>([
    "chatMessages",
    roomId,
  ]);

  if (!oldData?.pages[0]) return;

  const firstPage = oldData.pages[0];
  const updatedMessages = firstPage.result.messages.map((m) =>
    m.messageId === oldMessageId ? newMessage : m
  );

  queryClient.setQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>(
    ["chatMessages", roomId],
    {
      ...oldData,
      pages: [
        {
          ...firstPage,
          result: {
            ...firstPage.result,
            messages: updatedMessages,
          },
        },
        ...oldData.pages.slice(1),
      ],
    }
  );
};
