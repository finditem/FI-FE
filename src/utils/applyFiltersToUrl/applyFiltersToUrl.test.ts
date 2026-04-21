import { applyFiltersToUrl } from "./applyFiltersToUrl";

describe("applyFiltersToUrl", () => {
  describe("필터 값 변환", () => {
    it("category 값을 소문자 쿼리 파라미터로 변환한다", () => {
      const result = applyFiltersToUrl({
        filters: { category: "ELECTRONICS" },
        searchParams: new URLSearchParams(),
      });

      expect(new URLSearchParams(result).get("category")).toBe("electronics");
    });

    it("sort 값을 소문자 쿼리 파라미터로 변환한다", () => {
      const result = applyFiltersToUrl({
        filters: { sort: "MOST_VIEWED" },
        searchParams: new URLSearchParams(),
      });

      expect(new URLSearchParams(result).get("sort")).toBe("most_viewed");
    });

    it("findStatus 키는 URL에서 find-status로 변환된다", () => {
      const result = applyFiltersToUrl({
        filters: { findStatus: "FOUND" },
        searchParams: new URLSearchParams(),
      });

      expect(new URLSearchParams(result).get("find-status")).toBe("found");
    });

    it("region, startDate, endDate는 변환 없이 그대로 사용된다", () => {
      const result = applyFiltersToUrl({
        filters: { region: "서울", startDate: "2024-01-01", endDate: "2024-12-31" },
        searchParams: new URLSearchParams(),
      });

      const params = new URLSearchParams(result);
      expect(params.get("region")).toBe("서울");
      expect(params.get("startDate")).toBe("2024-01-01");
      expect(params.get("endDate")).toBe("2024-12-31");
    });
  });

  describe("파라미터 삭제", () => {
    it("undefined 값인 필터는 URL 파라미터에서 제거한다", () => {
      const result = applyFiltersToUrl({
        filters: { category: undefined },
        searchParams: new URLSearchParams("category=electronics"),
      });

      expect(new URLSearchParams(result).get("category")).toBeNull();
    });

    it("변환 결과가 없는 필터는 URL 파라미터에서 제거한다", () => {
      const result = applyFiltersToUrl({
        filters: { sort: undefined },
        searchParams: new URLSearchParams("sort=latest&category=electronics"),
      });

      const params = new URLSearchParams(result);
      expect(params.get("sort")).toBeNull();
      expect(params.get("category")).toBe("electronics");
    });
  });

  describe("기존 파라미터 보존", () => {
    it("filters에 포함되지 않은 기존 파라미터는 유지한다", () => {
      const result = applyFiltersToUrl({
        filters: { sort: "LATEST" },
        searchParams: new URLSearchParams("category=electronics"),
      });

      const params = new URLSearchParams(result);
      expect(params.get("category")).toBe("electronics");
      expect(params.get("sort")).toBe("latest");
    });

    it("여러 필터를 동시에 적용한다", () => {
      const result = applyFiltersToUrl({
        filters: { category: "WALLET", sort: "OLDEST" },
        searchParams: new URLSearchParams(),
      });

      const params = new URLSearchParams(result);
      expect(params.get("category")).toBe("wallet");
      expect(params.get("sort")).toBe("oldest");
    });
  });
});
