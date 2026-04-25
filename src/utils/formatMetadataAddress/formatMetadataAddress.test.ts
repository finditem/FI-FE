import { formatMetadataAddress } from "./formatMetadataAddress";

describe("formatMetadataAddress", () => {
  describe("address가 없는 경우", () => {
    it("undefined이면 '주소'를 반환한다", () => {
      expect(formatMetadataAddress(undefined)).toBe("주소");
    });

    it("null이면 '주소'를 반환한다", () => {
      expect(formatMetadataAddress(null)).toBe("주소");
    });

    it("빈 문자열이면 '주소'를 반환한다", () => {
      expect(formatMetadataAddress("")).toBe("주소");
    });
  });

  describe("동/면/읍 단위가 있는 경우", () => {
    it("괄호 안의 '동' 단위를 추출한다", () => {
      expect(formatMetadataAddress("대구광역시 동구 동북로 306-13 (신암동)")).toBe("신암동");
    });

    it("'동' 단위를 추출한다", () => {
      expect(formatMetadataAddress("서울특별시 강남구 역삼동")).toBe("역삼동");
    });

    it("'면' 단위를 추출한다", () => {
      expect(formatMetadataAddress("경기도 양평군 양동면 어딘가")).toBe("양동면");
    });

    it("'읍' 단위를 추출한다", () => {
      expect(formatMetadataAddress("경기도 양평군 양평읍 어딘가")).toBe("양평읍");
    });
  });

  describe("동/면/읍 단위가 없는 경우", () => {
    it("주소가 2단어 이상이면 앞 두 단어를 반환한다", () => {
      expect(formatMetadataAddress("서울특별시 강남구 테헤란로 123")).toBe("서울특별시 강남구");
    });

    it("주소가 1단어이면 그 단어를 반환한다", () => {
      expect(formatMetadataAddress("서울특별시")).toBe("서울특별시");
    });
  });
});
