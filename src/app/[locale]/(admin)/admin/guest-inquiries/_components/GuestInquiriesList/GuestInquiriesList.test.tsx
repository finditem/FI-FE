import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import GuestInquiriesList from "./GuestInquiriesList";

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock("@/hooks", () => ({
  useInfiniteScroll: () => ({
    ref: jest.fn(),
  }),
}));

jest.mock("@/api/fetch/admin", () => ({
  useGetGuestInquiries: () => ({
    data: [
      { inquiryId: 1 },
      { inquiryId: 2 },
      { inquiryId: 3 },
      { inquiryId: 4 },
      { inquiryId: 5 },
    ],
    isLoading: false,
    isError: false,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
}));

jest.mock("@/components/state", () => ({
  LoadingState: () => <div>loading...</div>,
  EmptyState: () => <div>empty...</div>,
}));

jest.mock("../../../_utils/toReportsItemVM/toReportsItemVM", () => ({
  toGuestInquiryItemVM: (v: any) => v,
}));

jest.mock("../../../_components", () => ({
  AdminReportsItem: () => <li data-testid="guest-inquiry-item" />,
}));

describe("GuestInquiriesList", () => {
  it("섹션 렌더링", () => {
    render(<GuestInquiriesList />);
    expect(screen.getByRole("region", { name: "비회원 문의 목록" })).toBeInTheDocument();
  });

  it("비회원 문의 아이템이 5개 렌더링", () => {
    render(<GuestInquiriesList />);
    expect(screen.getAllByTestId("guest-inquiry-item")).toHaveLength(5);
  });
});
