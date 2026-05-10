import { MOCK_CHAT_ITEM, MOCK_CHAT_ROOM_FOUND, MOCK_CHAT_ROOM_LOST } from "@/mock/data/chat.data";
import getPostMode from "./getPostMode";

describe("getPostMode", () => {
  it("인자가 없으면 lost를 반환한다", () => {
    expect(getPostMode(undefined)).toBe("lost");
  });

  it("postType이 FOUND이면 find를 반환한다", () => {
    expect(getPostMode(MOCK_CHAT_ROOM_FOUND)).toBe("find");
  });

  it("postType이 FOUND가 아니면 lost를 반환한다", () => {
    expect(getPostMode(MOCK_CHAT_ROOM_LOST)).toBe("lost");
    expect(getPostMode(MOCK_CHAT_ITEM)).toBe("lost");
  });
});
