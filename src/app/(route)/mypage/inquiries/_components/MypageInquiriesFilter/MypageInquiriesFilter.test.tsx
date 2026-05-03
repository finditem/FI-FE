import { render, screen, fireEvent } from "@testing-library/react";
import MypageInquiriesFilter from "./MypageInquiriesFilter";

const mockUpdateFilters = jest.fn();
const mockUseFilterParams = jest.fn();

jest.mock("@/hooks/domain", () => ({
  useFilterParams: () => mockUseFilterParams(),
  useFilterSync: () => ({ updateFilters: mockUpdateFilters }),
}));

jest.mock("@/utils", () => ({
  filterSelectionState: () => ({ isInquiryStatusSelected: false }),
  normalizedFilterValues: () => ({ normalizedInquiryStatus: undefined }),
  normalizeEnumValue: (v: unknown) => v,
}));

jest.mock("@/components/common", () => ({
  Filter: ({
    children,
    onClick,
    ariaLabel,
    onSelected,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    ariaLabel: string;
    onSelected: boolean;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} aria-pressed={onSelected}>
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

describe("MypageInquiriesFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterParams.mockReturnValue({ inquiryStatus: undefined });
  });

  it("필터 버튼이 렌더된다", () => {
    render(<MypageInquiriesFilter />);
    expect(screen.getByRole("button", { name: "필터" })).toBeInTheDocument();
  });

  it("기본 상태에서 필터 버튼 텍스트가 '상태'이다", () => {
    render(<MypageInquiriesFilter />);
    expect(screen.getByText("상태")).toBeInTheDocument();
  });

  it("필터 버튼 클릭 시 케밥 메뉴가 열린다", () => {
    render(<MypageInquiriesFilter />);
    expect(screen.queryByText("접수")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "필터" }));
    expect(screen.getByRole("button", { name: "접수" })).toBeInTheDocument();
  });

  it("케밥 메뉴 항목 클릭 시 updateFilters가 호출된다", () => {
    render(<MypageInquiriesFilter />);
    fireEvent.click(screen.getByRole("button", { name: "필터" }));
    fireEvent.click(screen.getByRole("button", { name: "접수" }));
    expect(mockUpdateFilters).toHaveBeenCalledWith({ inquiryStatus: "RECEIVED" });
  });
});
