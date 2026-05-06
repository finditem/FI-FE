import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBottomSheet from "./FilterBottomSheet";
import { FiltersStateType } from "../_types/filtersStateType";

const mockRouterReplace = jest.fn();
const mockApplyFiltersToUrl = jest.fn(() => "applied=true");

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ toString: () => "" }),
  useRouter: () => ({ replace: mockRouterReplace }),
  usePathname: () => "/",
}));

let mockVWorldReturn: { data: any[]; isLoading: boolean } = { data: [], isLoading: false };

jest.mock("@/hooks", () => ({
  useVWorldAddressSearch: () => mockVWorldReturn,
}));

jest.mock("@/utils", () => ({
  applyFiltersToUrl: (...args: any[]) => mockApplyFiltersToUrl(...args),
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
  highlightText: (text: string) => text,
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, onClick, ariaLabel }: any) => (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  Icon: () => <span />,
}));

jest.mock("../../PopupLayout/PopupLayout", () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
}));

const defaultFilters: FiltersStateType = {
  region: "",
  category: undefined,
  sort: "LATEST",
  status: undefined,
  findStatus: undefined,
  startDate: "",
  endDate: "",
};

const defaultProps = {
  isOpen: true,
  setIsOpen: jest.fn(),
  selectedTab: "region" as const,
  setSelectedTab: jest.fn(),
  filters: defaultFilters,
  setFilters: jest.fn(),
  pageType: "LIST" as const,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockVWorldReturn = { data: [], isLoading: false };
});

describe("<FilterBottomSheet />", () => {
  describe("기본 렌더링", () => {
    it("'필터' 제목이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} />);
      expect(screen.getByText("필터")).toBeInTheDocument();
    });

    it("'적용하기' 버튼이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} />);
      expect(screen.getByText("적용하기")).toBeInTheDocument();
    });

    it("isOpen=false이면 렌더되지 않는다", () => {
      render(<FilterBottomSheet {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("필터")).not.toBeInTheDocument();
    });
  });

  describe("탭 렌더링 (pageType='LIST')", () => {
    it("'지역 필터', '카테고리 필터', '정렬 필터', '찾음 여부 필터' 탭이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} />);
      expect(screen.getByRole("tab", { name: "지역 필터" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "카테고리 필터" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "정렬 필터" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "찾음 여부 필터" })).toBeInTheDocument();
    });

    it("'기간 필터' 탭은 렌더되지 않는다", () => {
      render(<FilterBottomSheet {...defaultProps} />);
      expect(screen.queryByRole("tab", { name: "기간 필터" })).not.toBeInTheDocument();
    });

    it("selectedTab에 해당하는 탭이 aria-selected=true이다", () => {
      render(<FilterBottomSheet {...defaultProps} selectedTab="category" />);
      expect(screen.getByRole("tab", { name: "카테고리 필터" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByRole("tab", { name: "지역 필터" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });

    it("탭 클릭 시 setSelectedTab이 해당 값으로 호출된다", () => {
      const setSelectedTab = jest.fn();
      render(<FilterBottomSheet {...defaultProps} setSelectedTab={setSelectedTab} />);
      fireEvent.click(screen.getByRole("tab", { name: "카테고리 필터" }));
      expect(setSelectedTab).toHaveBeenCalledWith("category");
    });
  });

  describe("지역 탭 (selectedTab='region')", () => {
    it("지역 검색 input이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} selectedTab="region" />);
      expect(screen.getByPlaceholderText("검색어를 입력하세요")).toBeInTheDocument();
    });

    it("input 입력 시 setFilters가 호출된다", () => {
      const setFilters = jest.fn();
      render(<FilterBottomSheet {...defaultProps} selectedTab="region" setFilters={setFilters} />);
      fireEvent.change(screen.getByPlaceholderText("검색어를 입력하세요"), {
        target: { value: "서울" },
      });
      expect(setFilters).toHaveBeenCalled();
    });

    it("검색어 2글자 이상 + 결과 없음 → '검색 결과가 없습니다.' 표시", () => {
      render(
        <FilterBottomSheet
          {...defaultProps}
          selectedTab="region"
          filters={{ ...defaultFilters, region: "서울" }}
        />
      );
      expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    });

    it("검색 결과 클릭 시 setFilters가 호출된다", () => {
      mockVWorldReturn = {
        data: [
          {
            address: {
              road: "서울특별시 중구 세종대로 110",
              parcel: "서울특별시 중구 태평로1가 31",
            },
          },
        ],
        isLoading: false,
      };
      const setFilters = jest.fn();
      render(
        <FilterBottomSheet
          {...defaultProps}
          selectedTab="region"
          filters={{ ...defaultFilters, region: "서울" }}
          setFilters={setFilters}
        />
      );
      fireEvent.click(screen.getByText("서울특별시 중구 세종대로 110"));
      expect(setFilters).toHaveBeenCalled();
    });

    it("검색어 2글자 이상 → 지우기 버튼 표시, 클릭 시 setFilters 호출", () => {
      const setFilters = jest.fn();
      render(
        <FilterBottomSheet
          {...defaultProps}
          selectedTab="region"
          filters={{ ...defaultFilters, region: "서울" }}
          setFilters={setFilters}
        />
      );
      const clearBtn = screen.getByRole("button", { name: "지역 검색어 지우기" });
      expect(clearBtn).toBeInTheDocument();
      fireEvent.click(clearBtn);
      expect(setFilters).toHaveBeenCalled();
    });
  });

  describe("카테고리 탭 (selectedTab='category')", () => {
    it("카테고리 칩 버튼들이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} selectedTab="category" />);
      expect(screen.getByText("전체")).toBeInTheDocument();
      expect(screen.getByText("전자기기")).toBeInTheDocument();
      expect(screen.getByText("지갑")).toBeInTheDocument();
    });

    it("선택된 카테고리가 aria-checked=true이다", () => {
      render(
        <FilterBottomSheet
          {...defaultProps}
          selectedTab="category"
          filters={{ ...defaultFilters, category: "ELECTRONICS" }}
        />
      );
      expect(screen.getByText("전자기기").closest("button")).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    it("칩 클릭 시 setFilters가 호출된다", () => {
      const setFilters = jest.fn();
      render(
        <FilterBottomSheet {...defaultProps} selectedTab="category" setFilters={setFilters} />
      );
      fireEvent.click(screen.getByText("전자기기"));
      expect(setFilters).toHaveBeenCalled();
    });
  });

  describe("정렬 탭 (selectedTab='sort')", () => {
    it("정렬 옵션들이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} selectedTab="sort" />);
      expect(screen.getByText("최신순")).toBeInTheDocument();
      expect(screen.getByText("오래된 순")).toBeInTheDocument();
    });

    it("정렬 칩 클릭 시 setFilters가 호출된다", () => {
      const setFilters = jest.fn();
      render(<FilterBottomSheet {...defaultProps} selectedTab="sort" setFilters={setFilters} />);
      fireEvent.click(screen.getByText("오래된 순"));
      expect(setFilters).toHaveBeenCalled();
    });
  });

  describe("찾음 여부 탭 (selectedTab='findStatus')", () => {
    it("찾음 여부 옵션들이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} selectedTab="findStatus" />);
      expect(screen.getByText("찾아요")).toBeInTheDocument();
      expect(screen.getByText("찾았어요")).toBeInTheDocument();
    });

    it("칩 클릭 시 setFilters가 호출된다", () => {
      const setFilters = jest.fn();
      render(
        <FilterBottomSheet {...defaultProps} selectedTab="findStatus" setFilters={setFilters} />
      );
      fireEvent.click(screen.getByText("찾아요"));
      expect(setFilters).toHaveBeenCalled();
    });
  });

  describe("분류 탭 (selectedTab='status')", () => {
    it("분류 옵션들이 렌더된다", () => {
      render(<FilterBottomSheet {...defaultProps} selectedTab="status" />);
      expect(screen.getByText("분실")).toBeInTheDocument();
      expect(screen.getByText("발견")).toBeInTheDocument();
    });

    it("칩 클릭 시 setFilters가 호출된다", () => {
      const setFilters = jest.fn();
      render(<FilterBottomSheet {...defaultProps} selectedTab="status" setFilters={setFilters} />);
      fireEvent.click(screen.getByText("분실"));
      expect(setFilters).toHaveBeenCalled();
    });
  });

  describe("적용 버튼", () => {
    it("'적용하기' 클릭 시 applyFiltersToUrl이 호출된다", () => {
      render(<FilterBottomSheet {...defaultProps} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(mockApplyFiltersToUrl).toHaveBeenCalled();
    });

    it("'적용하기' 클릭 시 router.replace가 호출된다", () => {
      render(<FilterBottomSheet {...defaultProps} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(mockRouterReplace).toHaveBeenCalled();
    });

    it("'적용하기' 클릭 시 setIsOpen(false)이 호출된다", () => {
      const setIsOpen = jest.fn();
      render(<FilterBottomSheet {...defaultProps} setIsOpen={setIsOpen} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });
});
