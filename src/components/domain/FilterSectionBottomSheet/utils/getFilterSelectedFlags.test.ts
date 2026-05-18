import { getFilterSelectedFlags } from "./getFilterSelectedFlags";
import { FiltersStateType } from "../_types/filtersStateType";

const base: FiltersStateType = {
  region: "",
  category: undefined,
  sort: "LATEST",
  status: undefined,
  findStatus: undefined,
  startDate: "",
  endDate: "",
};

describe("getFilterSelectedFlags", () => {
  describe("isRegionSelected", () => {
    it('region=""이면 false이다', () => {
      expect(getFilterSelectedFlags({ ...base, region: "" }).isRegionSelected).toBe(false);
    });

    it('region=" "(공백만)이면 false이다', () => {
      expect(getFilterSelectedFlags({ ...base, region: " " }).isRegionSelected).toBe(false);
    });

    it('region="서울"이면 true이다', () => {
      expect(getFilterSelectedFlags({ ...base, region: "서울" }).isRegionSelected).toBe(true);
    });
  });

  describe("isCategorySelected", () => {
    it("category=undefined이면 false이다", () => {
      expect(getFilterSelectedFlags({ ...base, category: undefined }).isCategorySelected).toBe(
        false
      );
    });

    it('category="ELECTRONICS"이면 true이다', () => {
      expect(getFilterSelectedFlags({ ...base, category: "ELECTRONICS" }).isCategorySelected).toBe(
        true
      );
    });
  });

  describe("isSortSelected", () => {
    it('sort="LATEST"이면 false이다 (기본값)', () => {
      expect(getFilterSelectedFlags({ ...base, sort: "LATEST" }).isSortSelected).toBe(false);
    });

    it('sort="OLDEST"이면 true이다', () => {
      expect(getFilterSelectedFlags({ ...base, sort: "OLDEST" }).isSortSelected).toBe(true);
    });

    it('sort="MOST_FAVORITED"이면 true이다', () => {
      expect(getFilterSelectedFlags({ ...base, sort: "MOST_FAVORITED" }).isSortSelected).toBe(true);
    });
  });

  describe("isStatusSelected", () => {
    it("status=undefined이면 false이다", () => {
      expect(getFilterSelectedFlags({ ...base, status: undefined }).isStatusSelected).toBe(false);
    });

    it('status="LOST"이면 true이다', () => {
      expect(getFilterSelectedFlags({ ...base, status: "LOST" }).isStatusSelected).toBe(true);
    });
  });

  describe("isFindStatusSelected", () => {
    it("findStatus=undefined이면 false이다", () => {
      expect(getFilterSelectedFlags({ ...base, findStatus: undefined }).isFindStatusSelected).toBe(
        false
      );
    });

    it('findStatus="SEARCHING"이면 true이다', () => {
      expect(
        getFilterSelectedFlags({ ...base, findStatus: "SEARCHING" }).isFindStatusSelected
      ).toBe(true);
    });

    it('findStatus="FOUND"이면 true이다', () => {
      expect(getFilterSelectedFlags({ ...base, findStatus: "FOUND" }).isFindStatusSelected).toBe(
        true
      );
    });
  });
});
