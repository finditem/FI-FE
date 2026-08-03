import { render, screen, fireEvent } from "@testing-library/react";
import ActivityFilterSection from "./ActivityFilterSection";

const mockUseActivityFilter = jest.fn();

jest.mock("../../_hooks/useActivityFilter", () => ({
  useActivityFilter: () => mockUseActivityFilter(),
}));

jest.mock("@/utils", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
  getDateRangeLabel: () => "기간",
}));

jest.mock("@/utils/deriveFilterParams/deriveFilterParams", () => ({
  filterSelectionState: () => ({ isDateSelected: false, isActivitySelected: false }),
  normalizedFilterValues: () => ({ normalizedActivity: undefined }),
}));

jest.mock("@/utils/getDateRangeLabel/getDateRangeLabel", () => ({
  getDateRangeLabel: () => "기간",
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
}));

jest.mock("@/components/domain", () => ({
  DateRangeBottomSheet: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>날짜 선택 시트</div> : null,
}));

jest.mock("../ActivityBottomSheet/ActivityBottomSheet", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div>활동 유형 시트</div> : null),
}));

describe("ActivityFilterSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseActivityFilter.mockReturnValue({
      filters: { startDate: "", endDate: "", activity: undefined },
      setFilters: jest.fn(),
      startDate: "",
      endDate: "",
      activity: undefined,
    });
  });

  it("기간 필터와 활동 유형 필터가 렌더된다", () => {
    render(<ActivityFilterSection />);
    expect(screen.getByRole("button", { name: "기간" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "활동 유형" })).toBeInTheDocument();
  });

  it("기간 필터 클릭 시 날짜 선택 시트가 열린다", () => {
    render(<ActivityFilterSection />);
    expect(screen.queryByText("날짜 선택 시트")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "기간" }));
    expect(screen.getByText("날짜 선택 시트")).toBeInTheDocument();
  });

  it("활동 유형 필터 클릭 시 활동 유형 시트가 열린다", () => {
    render(<ActivityFilterSection />);
    expect(screen.queryByText("활동 유형 시트")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "활동 유형" }));
    expect(screen.getByText("활동 유형 시트")).toBeInTheDocument();
  });
});
