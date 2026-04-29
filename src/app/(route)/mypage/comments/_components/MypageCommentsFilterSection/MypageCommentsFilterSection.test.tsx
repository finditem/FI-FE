import { render, screen, fireEvent } from "@testing-library/react";
import MypageCommentsFilterSection from "./MypageCommentsFilterSection";

const mockUpdateFilters = jest.fn();
const mockUseFilterParams = jest.fn();

jest.mock("@/hooks/domain", () => ({
  useFilterParams: () => mockUseFilterParams(),
  useFilterSync: () => ({
    filters: { startDate: "", endDate: "", simpleSort: "LATEST" },
    setFilters: jest.fn(),
    updateFilters: mockUpdateFilters,
  }),
}));

jest.mock("@/hooks/domain/useFilterSync/useFilterSync", () => ({
  useFilterSync: () => ({
    filters: { startDate: "", endDate: "", simpleSort: "LATEST" },
    setFilters: jest.fn(),
    updateFilters: mockUpdateFilters,
  }),
}));

jest.mock("@/utils", () => ({
  filterSelectionState: () => ({ isDateSelected: false, isSimpleSortSelected: false }),
  normalizedFilterValues: () => ({ normalizedSimpleSort: "LATEST" }),
  normalizeEnumValue: (v: unknown) => v,
  getDateRangeLabel: () => "기간",
}));

jest.mock("@/utils/deriveFilterParams/deriveFilterParams", () => ({
  filterSelectionState: () => ({ isDateSelected: false, isSimpleSortSelected: false }),
  normalizedFilterValues: () => ({ normalizedSimpleSort: "LATEST" }),
}));

jest.mock("@/components/common", () => ({
  Filter: ({
    children,
    onClick,
    ariaLabel,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel: string;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  KebabMenu: ({ items }: { items: { text: string; onClick: () => void }[] }) => (
    <ul>
      {items.map((item) => (
        <li key={item.text}>
          <button onClick={item.onClick}>{item.text}</button>
        </li>
      ))}
    </ul>
  ),
}));

jest.mock("@/components/domain", () => ({
  DateRangeBottomSheet: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>날짜 선택 시트</div> : null,
}));

describe("MypageCommentsFilterSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterParams.mockReturnValue({ startDate: "", endDate: "", simpleSort: "LATEST" });
  });

  it("기간 필터와 정렬 필터가 렌더된다", () => {
    render(<MypageCommentsFilterSection />);
    expect(screen.getByRole("button", { name: "기간" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "정렬 필터" })).toBeInTheDocument();
  });

  it("정렬 필터 기본 텍스트가 '최신순'이다", () => {
    render(<MypageCommentsFilterSection />);
    expect(screen.getByText("최신순")).toBeInTheDocument();
  });

  it("기간 필터 클릭 시 날짜 선택 시트가 열린다", () => {
    render(<MypageCommentsFilterSection />);
    expect(screen.queryByText("날짜 선택 시트")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "기간" }));
    expect(screen.getByText("날짜 선택 시트")).toBeInTheDocument();
  });

  it("정렬 필터 클릭 시 케밥 메뉴가 열린다", () => {
    render(<MypageCommentsFilterSection />);

    expect(screen.queryByRole("button", { name: "오래된순" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "정렬 필터" }));

    expect(screen.getByRole("button", { name: "최신순" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "오래된순" })).toBeInTheDocument();
  });

  it("정렬 항목 클릭 시 updateFilters가 호출된다", () => {
    render(<MypageCommentsFilterSection />);
    fireEvent.click(screen.getByRole("button", { name: "정렬 필터" }));
    fireEvent.click(screen.getByRole("button", { name: "오래된순" }));
    expect(mockUpdateFilters).toHaveBeenCalledWith({ simpleSort: "OLDEST" });
  });
});
