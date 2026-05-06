import {
  MOCK_WS_CHAT_MESSAGE_FOR_TRANSFORM_IMAGE,
  MOCK_WS_CHAT_MESSAGE_FOR_TRANSFORM_TEXT,
} from "@/mock/data/chat.data";
import transformWebSocketMessage from "./transformWebSocketMessage";

describe("transformWebSocketMessage", () => {
  it("roomId를 제외한 필드를 ChatMessage 형태로 옮긴다", () => {
    const result = transformWebSocketMessage(MOCK_WS_CHAT_MESSAGE_FOR_TRANSFORM_TEXT);

    expect(result).toEqual({
      messageId: 10,
      senderId: 3,
      content: "hi",
      messageType: "TEXT",
      createdAt: "2026-02-01T12:00:00.000Z",
      imageUrls: [],
    });
    expect("roomId" in result).toBe(false);
  });

  it("imageUrls가 있으면 그대로 복사한다", () => {
    expect(transformWebSocketMessage(MOCK_WS_CHAT_MESSAGE_FOR_TRANSFORM_IMAGE).imageUrls).toEqual([
      "x.png",
      "y.png",
    ]);
  });
});
