import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterSection from "./FilterSection";

let mockUseFilterParamsReturn: Record<string, any> = {
  region: undefined,
  category: undefined,
  sort: undefined,
  status: undefined,
  findStatus: undefined,
  startDate: undefined,
  endDate: undefined,
};

let mockSelectionState = {
  isRegionSelected: false,
  isCategorySelected: false,
  isSortSelected: false,
  isStatusSelected: false,
  isFindStatusSelected: false,
  isDateSelected: false,
};

let mockNormalizedValues = {
  normalizedCategory: undefined as any,
  normalizedSort: undefined as any,
  normalizedStatus: undefined as any,
  normalizedFindStatus: undefined as any,
};

jest.mock("@/hooks", () => ({
  useFilterParams: () => mockUseFilterParamsReturn,
}));

jest.mock("../../../../utils/deriveFilterParams/deriveFilterParams", () => ({
  filterSelectionState: () => mockSelectionState,
  normalizedFilterValues: () => mockNormalizedValues,
}));

jest.mock("@/utils", () => ({
  normalizeEnumValue: jest.fn((val: any) => val),
}));

jest.mock("@/utils/getDateRangeLabel/getDateRangeLabel", () => ({
  getDateRangeLabel: jest.fn(() => "기간 선택"),
}));

jest.mock("@/components/common", () => ({
  Filter: ({ children, onClick, ariaLabel }: any) => (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

jest.mock("../FilterBottomSheet/FilterBottomSheet", () => ({
  __esModule: true,
  default: ({ isOpen }: any) => (isOpen ? <div data-testid="filter-bottom-sheet" /> : null),
}));

jest.mock("../../DateRangeBottomSheet/DateRangeBottomSheet", () => ({
  __esModule: true,
  default: ({ isOpen }: any) => (isOpen ? <div data-testid="date-range-bottom-sheet" /> : null),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseFilterParamsReturn = {
    region: undefined,
    category: undefined,
    sort: undefined,
    status: undefined,
    findStatus: undefined,
    startDate: undefined,
    endDate: undefined,
  };
  mockSelectionState = {
    isRegionSelected: false,
    isCategorySelected: false,
    isSortSelected: false,
    isStatusSelected: false,
    isFindStatusSelected: false,
    isDateSelected: false,
  };
  mockNormalizedValues = {
    normalizedCategory: undefined,
    normalizedSort: undefined,
    normalizedStatus: undefined,
    normalizedFindStatus: undefined,
  };
});

describe("<FilterSection />", () => {
  describe("pageType별 필터 버튼 렌더링", () => {
    it("pageType='LIST'이면 지역/카테고리/정렬/찾음 여부 필터 버튼 4개가 렌더된다", () => {
      render(<FilterSection pageType="LIST" />);
      expect(screen.getByRole("button", { name: "지역 선택 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "카테고리 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "정렬 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "찾음 여부 필터" })).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(4);
    });

    it("pageType='MY_POSTS'이면 기간/분류/카테고리/정렬/찾음 여부 필터 버튼 5개가 렌더된다", () => {
      render(<FilterSection pageType="MY_POSTS" />);
      expect(screen.getByRole("button", { name: "기간 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "분류 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "카테고리 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "정렬 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "찾음 여부 필터" })).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(5);
    });

    it("pageType='MY_FAVORITES'이면 지역/분류/카테고리/정렬 필터 버튼 4개가 렌더된다", () => {
      render(<FilterSection pageType="MY_FAVORITES" />);
      expect(screen.getByRole("button", { name: "지역 선택 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "분류 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "카테고리 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "정렬 필터" })).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(4);
    });

    it("pageType='PUBLIC_DATA'이면 지역/카테고리 필터 버튼 2개가 렌더된다", () => {
      render(<FilterSection pageType="PUBLIC_DATA" />);
      expect(screen.getByRole("button", { name: "지역 선택 필터" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "카테고리 필터" })).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });
  });

  describe("필터 바텀시트 열림/닫힘", () => {
    it("'지역 선택 필터' 클릭 시 FilterBottomSheet가 렌더된다", () => {
      render(<FilterSection pageType="LIST" />);
      fireEvent.click(screen.getByRole("button", { name: "지역 선택 필터" }));
      expect(screen.getByTestId("filter-bottom-sheet")).toBeInTheDocument();
    });

    it("'카테고리 필터' 클릭 시 FilterBottomSheet가 렌더된다", () => {
      render(<FilterSection pageType="LIST" />);
      fireEvent.click(screen.getByRole("button", { name: "카테고리 필터" }));
      expect(screen.getByTestId("filter-bottom-sheet")).toBeInTheDocument();
    });

    it("'기간 필터' 클릭 시 DateRangeBottomSheet가 렌더된다 (MY_POSTS)", () => {
      render(<FilterSection pageType="MY_POSTS" />);
      fireEvent.click(screen.getByRole("button", { name: "기간 필터" }));
      expect(screen.getByTestId("date-range-bottom-sheet")).toBeInTheDocument();
    });

    it("'기간 필터' 클릭 시 FilterBottomSheet는 렌더되지 않는다", () => {
      render(<FilterSection pageType="MY_POSTS" />);
      fireEvent.click(screen.getByRole("button", { name: "기간 필터" }));
      expect(screen.queryByTestId("filter-bottom-sheet")).not.toBeInTheDocument();
    });
  });

  describe("필터 선택 상태", () => {
    it("isRegionSelected=true이면 지역 필터 버튼에 region 값이 표시된다", () => {
      mockUseFilterParamsReturn = { ...mockUseFilterParamsReturn, region: "서울" };
      mockSelectionState = { ...mockSelectionState, isRegionSelected: true };
      render(<FilterSection pageType="LIST" />);
      expect(screen.getByRole("button", { name: "지역 선택 필터" })).toHaveTextContent("서울");
    });

    it("isRegionSelected=false이면 '지역 선택' 레이블이 표시된다", () => {
      render(<FilterSection pageType="LIST" />);
      expect(screen.getByRole("button", { name: "지역 선택 필터" })).toHaveTextContent("지역 선택");
    });
  });
});
