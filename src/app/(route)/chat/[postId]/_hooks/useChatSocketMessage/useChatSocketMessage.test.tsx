import { renderHook } from "@testing-library/react";
import { InfiniteData, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { WebSocketChatMessage } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { ChatMessageResponse } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import type { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import {
  MOCK_CHAT_MESSAGE_OPTIMISTIC,
  MOCK_CHAT_MESSAGE_SOCKET_HISTORY,
  MOCK_CHAT_MESSAGE_WS_ALREADY_PRESENT,
  MOCK_WS_CHAT_MESSAGE,
} from "@/mock/data/chat.data";
import useChatSocketMessage from "./useChatSocketMessage";

const socketCallbacks: {
  onMessage?: (message: WebSocketChatMessage) => void;
  onListUpdate?: () => void;
} = {};

jest.mock("@/api/fetch/chatRoom", () => ({
  useChatSocket: jest.fn((opts: typeof socketCallbacks) => {
    socketCallbacks.onMessage = opts.onMessage;
    socketCallbacks.onListUpdate = opts.onListUpdate;
  }),
}));

const mockMutate = jest.fn();
jest.mock("@/api/fetch/chatMessage/api/useReadMessage", () => ({
  __esModule: true,
  default: jest.fn(() => ({ mutate: mockMutate })),
}));

jest.mock("../../_utils", () => {
  const actual = jest.requireActual("../../_utils") as Record<string, unknown>;
  return {
    ...actual,
    findOptimisticMessage: jest.fn(),
    addMessageToCache: jest.fn(),
    replaceMessageInCache: jest.fn(),
  };
});

import { findOptimisticMessage, addMessageToCache, replaceMessageInCache } from "../../_utils";

const mockFindOptimisticMessage = jest.mocked(findOptimisticMessage);
const mockAddMessageToCache = jest.mocked(addMessageToCache);
const mockReplaceMessageInCache = jest.mocked(replaceMessageInCache);

const makeWsMessage = (overrides: Partial<WebSocketChatMessage> = {}): WebSocketChatMessage => ({
  ...MOCK_WS_CHAT_MESSAGE,
  ...overrides,
});

describe("useChatSocketMessage", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const emitMessage = (message: WebSocketChatMessage) => {
    socketCallbacks.onMessage?.(message);
  };

  const emitListUpdate = () => {
    socketCallbacks.onListUpdate?.();
  };

  const seedChatMessages = (messages: ChatMessage[]) => {
    queryClient.setQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>(
      ["chatMessages", 5],
      {
        pages: [
          {
            isSuccess: true,
            code: "COMMON200",
            message: "성공",
            result: {
              messages,
              nextCursor: null,
            },
          },
        ],
        pageParams: [undefined],
      }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    socketCallbacks.onMessage = undefined;
    socketCallbacks.onListUpdate = undefined;
    mockFindOptimisticMessage.mockReturnValue(undefined);
  });

  it("roomId가 0이면 메시지 핸들러가 조기 종료한다", () => {
    renderHook(() => useChatSocketMessage(0, 1), { wrapper });
    emitMessage(makeWsMessage({ roomId: 5 }));

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockAddMessageToCache).not.toHaveBeenCalled();
  });

  it("웹소켓 roomId가 현재 방과 다르면 처리하지 않는다", () => {
    renderHook(() => useChatSocketMessage(5, 1), { wrapper });
    emitMessage(makeWsMessage({ roomId: 99 }));

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockAddMessageToCache).not.toHaveBeenCalled();
  });

  it("채팅 메시지 쿼리가 없으면 무효화만 하고 캐시 조작은 하지 않는다", () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useChatSocketMessage(5, 10), { wrapper });
    emitMessage(makeWsMessage());

    expect(mockMutate).toHaveBeenCalledWith(undefined);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["chatMessages", 5] });
    expect(mockAddMessageToCache).not.toHaveBeenCalled();
    expect(mockReplaceMessageInCache).not.toHaveBeenCalled();

    invalidateSpy.mockRestore();
  });

  it("낙관적 메시지가 있으면 replaceMessageInCache로 교체한다", () => {
    seedChatMessages([]);
    mockFindOptimisticMessage.mockReturnValue(MOCK_CHAT_MESSAGE_OPTIMISTIC);

    renderHook(() => useChatSocketMessage(5, 10), { wrapper });
    emitMessage(makeWsMessage());

    expect(mockReplaceMessageInCache).toHaveBeenCalledTimes(1);
    expect(mockReplaceMessageInCache.mock.calls[0][0]).toBe(queryClient);
    expect(mockReplaceMessageInCache.mock.calls[0][1]).toBe(5);
    expect(mockReplaceMessageInCache.mock.calls[0][2]).toBe(-1);
    expect(mockReplaceMessageInCache.mock.calls[0][3]).toMatchObject({
      messageId: 100,
      content: "안녕",
      senderId: 2,
    });
    expect(mockAddMessageToCache).not.toHaveBeenCalled();
  });

  it("낙관적 메시지가 없고 동일 messageId가 없으면 addMessageToCache한다", () => {
    seedChatMessages([MOCK_CHAT_MESSAGE_SOCKET_HISTORY]);

    renderHook(() => useChatSocketMessage(5, 10), { wrapper });
    emitMessage(makeWsMessage({ messageId: 200 }));

    expect(mockAddMessageToCache).toHaveBeenCalledTimes(1);
    expect(mockAddMessageToCache.mock.calls[0][0]).toBe(queryClient);
    expect(mockAddMessageToCache.mock.calls[0][1]).toBe(5);
    expect(mockAddMessageToCache.mock.calls[0][2]).toMatchObject({
      messageId: 200,
      content: "안녕",
    });
    expect(mockReplaceMessageInCache).not.toHaveBeenCalled();
  });

  it("이미 같은 messageId가 있으면 추가하지 않는다", () => {
    seedChatMessages([MOCK_CHAT_MESSAGE_WS_ALREADY_PRESENT]);

    renderHook(() => useChatSocketMessage(5, 10), { wrapper });
    emitMessage(makeWsMessage());

    expect(mockAddMessageToCache).not.toHaveBeenCalled();
    expect(mockReplaceMessageInCache).not.toHaveBeenCalled();
  });

  it("currentUserId와 senderId가 같으면 읽음 처리를 호출하지 않는다", () => {
    seedChatMessages([]);

    renderHook(() => useChatSocketMessage(5, 2), { wrapper });
    emitMessage(makeWsMessage({ senderId: 2 }));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("currentUserId가 없으면 상대 메시지로 보고 읽음 처리를 호출한다", () => {
    seedChatMessages([]);

    renderHook(() => useChatSocketMessage(5, undefined), { wrapper });
    emitMessage(makeWsMessage({ senderId: 2 }));

    expect(mockMutate).toHaveBeenCalledWith(undefined);
  });

  it("onListUpdate 시 chatList 쿼리를 무효화한다", () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useChatSocketMessage(5), { wrapper });
    emitListUpdate();

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["chatList"] });

    invalidateSpy.mockRestore();
  });
});
