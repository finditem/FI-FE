import { render, screen } from "@testing-library/react";
import { MOCK_RECEIVED_REVIEWS } from "@/mock/data";
import ReviewsContent from "./ReviewsContent";

jest.mock("@/components", () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="empty-state">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  ReviewCard: ({ data }: { data: { id: number | string; nickname: string } }) => (
    <li data-testid="review-card">{data.nickname}</li>
  ),
}));

describe("ReviewsContent", () => {
  it("받은 후기 탭은 후기 개수와 카드 목록을 렌더한다", () => {
    render(<ReviewsContent selectedTab="received" />);

    expect(screen.getByText("후기")).toBeInTheDocument();
    expect(screen.getByText(String(MOCK_RECEIVED_REVIEWS.length))).toBeInTheDocument();
    expect(screen.getAllByTestId("review-card")).toHaveLength(MOCK_RECEIVED_REVIEWS.length);
  });

  it("보낸 후기 탭은 보낸 후기 빈 상태를 렌더한다", () => {
    render(<ReviewsContent selectedTab="sent" />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("아직 보낸 후기가 없어요")).toBeInTheDocument();
    expect(screen.queryByTestId("review-card")).not.toBeInTheDocument();
  });
});
