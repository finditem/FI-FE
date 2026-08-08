import type { WebSocketChatMessage } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import {
  MOCK_CHAT_MESSAGE_CONFIRMED_MATCHING_WS_TEXT,
  MOCK_CHAT_MESSAGE_OPTIMISTIC,
  MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_EMPTY_URLS,
  MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_LOCAL,
  MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_URLS_FOR_MISMATCH,
  MOCK_CHAT_MESSAGE_OPTIMISTIC_TEXT_CONTENT_MISMATCH,
  MOCK_CHAT_MESSAGE_OPTIMISTIC_TEXT_SENDER_MISMATCH,
  MOCK_WS_CHAT_MESSAGE,
  MOCK_WS_CHAT_MESSAGE_IMAGE_NO_URLS,
  MOCK_WS_CHAT_MESSAGE_IMAGE_SINGLE,
  MOCK_WS_CHAT_MESSAGE_IMAGE_TWO,
} from "@/mock/data/chat.data";
import findOptimisticMessage from "./findOptimisticMessage";

const wsBase = (overrides: Partial<WebSocketChatMessage> = {}): WebSocketChatMessage => ({
  ...MOCK_WS_CHAT_MESSAGE,
  ...overrides,
});

describe("findOptimisticMessage", () => {
  it("메시지 목록이 비어 있으면 undefined를 반환한다", () => {
    expect(findOptimisticMessage([], wsBase())).toBeUndefined();
  });

  it("낙관적 메시지(messageId < 0)가 없으면 undefined를 반환한다", () => {
    expect(
      findOptimisticMessage([MOCK_CHAT_MESSAGE_CONFIRMED_MATCHING_WS_TEXT], wsBase())
    ).toBeUndefined();
  });

  it("TEXT 타입에서 내용·발신자가 일치하는 낙관적 메시지를 찾는다", () => {
    expect(findOptimisticMessage([MOCK_CHAT_MESSAGE_OPTIMISTIC], wsBase())).toBe(
      MOCK_CHAT_MESSAGE_OPTIMISTIC
    );
  });

  it("TEXT에서 내용이 다르면 매칭하지 않는다", () => {
    expect(
      findOptimisticMessage([MOCK_CHAT_MESSAGE_OPTIMISTIC_TEXT_CONTENT_MISMATCH], wsBase())
    ).toBeUndefined();
  });

  it("TEXT에서 발신자가 다르면 매칭하지 않는다", () => {
    expect(
      findOptimisticMessage([MOCK_CHAT_MESSAGE_OPTIMISTIC_TEXT_SENDER_MISMATCH], wsBase())
    ).toBeUndefined();
  });

  it("IMAGE 타입에서 동일 발신자·이미지 개수가 같으면 매칭한다", () => {
    expect(
      findOptimisticMessage(
        [MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_LOCAL],
        MOCK_WS_CHAT_MESSAGE_IMAGE_TWO
      )
    ).toBe(MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_LOCAL);
  });

  it("IMAGE에서 웹소켓 imageUrls가 없으면 길이 0과 비교한다", () => {
    expect(
      findOptimisticMessage(
        [MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_EMPTY_URLS],
        MOCK_WS_CHAT_MESSAGE_IMAGE_NO_URLS
      )
    ).toBe(MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_EMPTY_URLS);
  });

  it("IMAGE에서 이미지 개수가 다르면 매칭하지 않는다", () => {
    expect(
      findOptimisticMessage(
        [MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_URLS_FOR_MISMATCH],
        MOCK_WS_CHAT_MESSAGE_IMAGE_SINGLE
      )
    ).toBeUndefined();
  });

  it("배열 앞쪽부터 첫 매칭만 반환한다", () => {
    const second = { ...MOCK_CHAT_MESSAGE_OPTIMISTIC, messageId: -2 };
    expect(findOptimisticMessage([MOCK_CHAT_MESSAGE_OPTIMISTIC, second], wsBase())).toBe(
      MOCK_CHAT_MESSAGE_OPTIMISTIC
    );
  });
});
