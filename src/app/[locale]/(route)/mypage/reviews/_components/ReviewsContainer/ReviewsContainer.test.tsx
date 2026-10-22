import { fireEvent, render, screen } from "@testing-library/react";
import { useReviewTabQuery } from "../../_hooks/useReviewTabQuery/useReviewTabQuery";
import ReviewsContainer from "./ReviewsContainer";

jest.mock("../../_hooks/useReviewTabQuery/useReviewTabQuery");

jest.mock("../ReviewsContent/ReviewsContent", () => ({
  __esModule: true,
  default: ({ selectedTab }: { selectedTab: string }) => (
    <div data-testid="reviews-content">{selectedTab}</div>
  ),
}));

jest.mock("@/components", () => ({
  Tab: ({
    tabs,
    onValueChange,
  }: {
    tabs: ReadonlyArray<{ key: string; label: string }>;
    onValueChange: (key: string) => void;
  }) => (
    <div data-testid="tab">
      {tabs.map((tab) => (
        <button key={tab.key} type="button" onClick={() => onValueChange(tab.key)}>
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

const mockUseReviewTabQuery = useReviewTabQuery as jest.Mock;

describe("ReviewsContainer", () => {
  const mockUpdateTabQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReviewTabQuery.mockReturnValue({ tab: "received", updateTabQuery: mockUpdateTabQuery });
  });

  it("받은 후기와 보낸 후기 탭만 렌더한다", () => {
    render(<ReviewsContainer />);

    expect(screen.getByRole("button", { name: "받은 후기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "보낸 후기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "숨긴 후기" })).not.toBeInTheDocument();
  });

  it("현재 선택된 탭을 콘텐츠에 전달한다", () => {
    mockUseReviewTabQuery.mockReturnValue({ tab: "sent", updateTabQuery: mockUpdateTabQuery });

    render(<ReviewsContainer />);

    expect(screen.getByTestId("reviews-content")).toHaveTextContent("sent");
  });

  it("탭을 클릭하면 해당 키로 updateTabQuery를 호출한다", () => {
    render(<ReviewsContainer />);

    fireEvent.click(screen.getByRole("button", { name: "보낸 후기" }));

    expect(mockUpdateTabQuery).toHaveBeenCalledWith("sent");
  });
});
