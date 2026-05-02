import formatChatTime from "./formatChatTime";

describe("formatChatTime", () => {
  it("로컬 시각 10:30으로 해석되면 10:30을 반환한다 (시간대 무관, 타임존 없는 ISO)", () => {
    expect(formatChatTime("2020-01-15T10:30:00")).toBe("10:30");
  });

  it("파싱 실패 시 빈 문자열", () => {
    expect(formatChatTime("not-a-date")).toBe("");
  });

  it("빈 문자열이면 빈 문자열", () => {
    expect(formatChatTime("")).toBe("");
  });
});
