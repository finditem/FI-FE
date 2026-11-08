import { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type {
  ChatMessageResponse,
  ChatMessage,
} from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import {
  MOCK_CHAT_MESSAGE_AFTER_SERVER_REPLACE,
  MOCK_CHAT_MESSAGE_CACHE_PREPEND_INCOMING,
  MOCK_CHAT_MESSAGES,
} from "@/mock/data/chat.data";
import {
  addMessageToCache,
  removeMessageFromCache,
  replaceMessageInCache,
} from "./chatMessageCache";

const ROOM_ID = 7;

const seedCache = (
  queryClient: QueryClient,
  messagesPerPage: ChatMessage[][],
  pageParams: unknown[] = messagesPerPage.map((_, i) => (i === 0 ? undefined : i))
) => {
  const pages = messagesPerPage.map(
    (messages): ApiBaseResponseType<ChatMessageResponse> => ({
      isSuccess: true,
      code: "COMMON200",
      message: "성공",
      result: {
        messages,
        nextCursor: null,
      },
    })
  );

  queryClient.setQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>(
    ["chatMessages", ROOM_ID],
    {
      pages,
      pageParams,
    }
  );
};

const getMessages = (queryClient: QueryClient): ChatMessage[] =>
  queryClient.getQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>([
    "chatMessages",
    ROOM_ID,
  ])!.pages[0].result.messages;

describe("chatMessageCache", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  describe("addMessageToCache", () => {
    it("캐시가 없으면 아무 것도 하지 않는다", () => {
      const msg = MOCK_CHAT_MESSAGES[0];
      expect(() => addMessageToCache(queryClient, ROOM_ID, msg)).not.toThrow();
      expect(queryClient.getQueryData(["chatMessages", ROOM_ID])).toBeUndefined();
    });

    it("첫 페이지 맨 앞에 메시지를 추가하고 나머지 페이지는 유지한다", () => {
      seedCache(queryClient, [[MOCK_CHAT_MESSAGES[0]], [MOCK_CHAT_MESSAGES[1]]]);

      addMessageToCache(queryClient, ROOM_ID, MOCK_CHAT_MESSAGE_CACHE_PREPEND_INCOMING);

      const data = queryClient.getQueryData<InfiniteData<ApiBaseResponseType<ChatMessageResponse>>>(
        ["chatMessages", ROOM_ID]
      )!;

      expect(data.pages).toHaveLength(2);
      expect(data.pages[0].result.messages).toEqual([
        MOCK_CHAT_MESSAGE_CACHE_PREPEND_INCOMING,
        MOCK_CHAT_MESSAGES[0],
      ]);
      expect(data.pages[1].result.messages).toEqual([MOCK_CHAT_MESSAGES[1]]);
    });
  });

  describe("removeMessageFromCache", () => {
    it("해당 messageId만 제거한다", () => {
      seedCache(queryClient, [MOCK_CHAT_MESSAGES]);

      removeMessageFromCache(queryClient, ROOM_ID, MOCK_CHAT_MESSAGES[0].messageId);

      expect(getMessages(queryClient)).toEqual([MOCK_CHAT_MESSAGES[1]]);
    });

    it("일치하는 id가 없어도 에러 없이 동일 구조를 유지한다", () => {
      seedCache(queryClient, [MOCK_CHAT_MESSAGES]);

      removeMessageFromCache(queryClient, ROOM_ID, 9_999);

      expect(getMessages(queryClient)).toEqual(MOCK_CHAT_MESSAGES);
    });
  });

  describe("replaceMessageInCache", () => {
    it("oldMessageId에 해당하는 항목만 교체한다", () => {
      seedCache(queryClient, [MOCK_CHAT_MESSAGES]);

      replaceMessageInCache(
        queryClient,
        ROOM_ID,
        MOCK_CHAT_MESSAGES[0].messageId,
        MOCK_CHAT_MESSAGE_AFTER_SERVER_REPLACE
      );

      expect(getMessages(queryClient)).toEqual([
        MOCK_CHAT_MESSAGE_AFTER_SERVER_REPLACE,
        MOCK_CHAT_MESSAGES[1],
      ]);
    });
  });
});
