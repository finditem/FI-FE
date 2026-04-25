import { formatMetadataKeyword } from "./formatMetadataKeyword";

describe("formatMetadataKeyword", () => {
  describe("keyword가 없는 경우", () => {
    it("undefined이면 '물건'을 반환한다", () => {
      expect(formatMetadataKeyword(undefined)).toBe("물건");
    });

    it("빈 문자열이면 '물건'을 반환한다", () => {
      expect(formatMetadataKeyword("")).toBe("물건");
    });
  });

  describe("keyword가 있는 경우", () => {
    it("일반 문자열은 그대로 반환한다", () => {
      expect(formatMetadataKeyword("지갑")).toBe("지갑");
    });

    it("< > 특수문자를 제거한다", () => {
      expect(formatMetadataKeyword("<b>굵게</b>")).toBe("b굵게/b");
    });

    it("20자를 초과하면 20자로 제한한다", () => {
      expect(formatMetadataKeyword("가".repeat(25))).toBe("가".repeat(20));
    });

    it("< > 제거 후에도 20자를 초과하면 20자로 제한한다", () => {
      expect(formatMetadataKeyword("<" + "가".repeat(25) + ">")).toBe("가".repeat(20));
    });
  });
});
