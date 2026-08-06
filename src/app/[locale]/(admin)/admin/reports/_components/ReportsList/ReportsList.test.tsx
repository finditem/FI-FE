import { render, screen } from "@testing-library/react";
import ReportsList from "./ReportsList";
import { MOCK_ADMIN_REPORT_LIST, MOCK_ADMIN_INQUIRY_LIST } from "@/mock/data";

const mockUseReportsListQuery = jest.fn();

jest.mock("../../_hooks/useReportsListQuery", () => ({
  useReportsListQuery: (args: any) => mockUseReportsListQuery(args),
}));

jest.mock("@/hooks", () => ({
  useInfiniteScroll: () => ({
    ref: jest.fn(),
  }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock("../../../_utils/toReportsItemVM/toReportsItemVM", () => ({
  toReportItemVM: (v: any) => v,
  toInquiryItemVM: (v: any) => v,
}));

jest.mock("../../../_components", () => ({
  AdminReportsItem: () => <li data-testid="reports-item" />,
}));

describe("ReportsList", () => {
  it("섹션 렌더링", () => {
    mockUseReportsListQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });

    render(<ReportsList activeTab="report" />);

    expect(screen.getByRole("region", { name: "신고/문의 목록" })).toBeInTheDocument();
  });

  it("activeTab이 report인 경우 신고 목록 개수만큼 렌더", () => {
    mockUseReportsListQuery.mockReturnValue({
      data: MOCK_ADMIN_REPORT_LIST,
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });

    render(<ReportsList activeTab="report" />);

    expect(screen.getAllByTestId("reports-item")).toHaveLength(MOCK_ADMIN_REPORT_LIST.length);
  });

  it("activeTab이 inquiry인 경우 문의 목록 개수만큼 렌더", () => {
    mockUseReportsListQuery.mockReturnValue({
      data: MOCK_ADMIN_INQUIRY_LIST,
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });

    render(<ReportsList activeTab="inquiry" />);

    expect(screen.getAllByTestId("reports-item")).toHaveLength(MOCK_ADMIN_INQUIRY_LIST.length);
  });
});
