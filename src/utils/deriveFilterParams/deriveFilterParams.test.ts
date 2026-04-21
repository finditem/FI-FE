import { filterSelectionState, normalizedFilterValues } from "./deriveFilterParams";

describe("normalizedFilterValues", () => {
  it("소문자 쿼리 파라미터를 대문자 enum 값으로 정규화한다", () => {
    const result = normalizedFilterValues({ category: "electronics", sort: "latest" });

    expect(result.normalizedCategory).toBe("ELECTRONICS");
    expect(result.normalizedSort).toBe("LATEST");
  });

  it("null 값은 undefined로 반환한다", () => {
    const result = normalizedFilterValues({ category: null, sort: null });

    expect(result.normalizedCategory).toBeUndefined();
    expect(result.normalizedSort).toBeUndefined();
  });

  it("파라미터가 없으면 모든 값이 undefined를 반환한다", () => {
    const result = normalizedFilterValues({});

    expect(result.normalizedCategory).toBeUndefined();
    expect(result.normalizedSort).toBeUndefined();
    expect(result.normalizedStatus).toBeUndefined();
    expect(result.normalizedFindStatus).toBeUndefined();
    expect(result.normalizedActivity).toBeUndefined();
    expect(result.normalizedSimpleSort).toBeUndefined();
    expect(result.normalizedReportStatus).toBeUndefined();
    expect(result.normalizedInquiryStatus).toBeUndefined();
  });
});

describe("filterSelectionState", () => {
  it("값이 있는 파라미터는 true를 반환한다", () => {
    const result = filterSelectionState({
      region: "서울",
      category: "electronics",
      sort: "latest",
    });

    expect(result.isRegionSelected).toBe(true);
    expect(result.isCategorySelected).toBe(true);
    expect(result.isSortSelected).toBe(true);
  });

  it("null 또는 undefined인 파라미터는 false를 반환한다", () => {
    const result = filterSelectionState({ region: null, category: undefined });

    expect(result.isRegionSelected).toBe(false);
    expect(result.isCategorySelected).toBe(false);
  });

  it("파라미터가 없으면 모든 값이 false를 반환한다", () => {
    const result = filterSelectionState({});

    expect(result.isRegionSelected).toBe(false);
    expect(result.isCategorySelected).toBe(false);
    expect(result.isSortSelected).toBe(false);
    expect(result.isStatusSelected).toBe(false);
    expect(result.isFindStatusSelected).toBe(false);
    expect(result.isDateSelected).toBe(false);
    expect(result.isActivitySelected).toBe(false);
    expect(result.isSimpleSortSelected).toBe(false);
    expect(result.isReportStatusSelected).toBe(false);
    expect(result.isInquiryStatusSelected).toBe(false);
  });

  describe("날짜 범위 선택 여부 (isDateSelected)", () => {
    it("시작일만 있어도 true를 반환한다", () => {
      expect(filterSelectionState({ startDate: "2024-01-01", endDate: null }).isDateSelected).toBe(
        true
      );
    });

    it("종료일만 있어도 true를 반환한다", () => {
      expect(filterSelectionState({ startDate: null, endDate: "2024-12-31" }).isDateSelected).toBe(
        true
      );
    });

    it("시작일과 종료일 모두 없으면 false를 반환한다", () => {
      expect(filterSelectionState({ startDate: null, endDate: null }).isDateSelected).toBe(false);
    });
  });
});
