import { render, screen } from "@testing-library/react";
import { useGetMyReviews } from "@/api/fetch/review";
import { MOCK_REVIEW_LIST_ITEM } from "@/mock/data";
import ReviewsContent from "./ReviewsContent";

jest.mock("@/api/fetch/review", () => ({ useGetMyReviews: jest.fn() }));
jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: jest.fn() }),
}));
jest.mock("@/hooks", () => ({
  useInfiniteScroll: () => ({ ref: jest.fn() }),
}));
jest.mock("@/components", () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="empty-state">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
  ReviewCard: ({
    data,
    showHideMenu,
  }: {
    data: { id: number; nickname: string; extraTagCount?: number };
    showHideMenu: boolean;
  }) => (
    <li data-testid="review-card" data-hide-menu={showHideMenu}>
      {data.nickname}:{data.extraTagCount}
    </li>
  ),
}));

const mockUseGetMyReviews = jest.mocked(useGetMyReviews);
const baseQueryResult = {
  isLoading: false,
  isError: false,
  fetchNextPage: jest.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
};

describe("ReviewsContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetMyReviews.mockReturnValue({
      ...baseQueryResult,
      data: { reviewList: [MOCK_REVIEW_LIST_ITEM], reviewCount: 1 },
    } as unknown as ReturnType<typeof useGetMyReviews>);
  });

  it("받은 후기 탭은 RECEIVED 목록과 전체 개수를 렌더한다", () => {
    render(<ReviewsContent selectedTab="received" />);

    expect(mockUseGetMyReviews).toHaveBeenCalledWith({ type: "RECEIVED" });
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByTestId("review-card")).toHaveAttribute("data-hide-menu", "true");
    expect(screen.getByTestId("review-card")).toHaveTextContent("우주강아지:1");
  });

  it("보낸 후기 탭은 SENT 목록을 요청하고 숨기기 메뉴를 노출하지 않는다", () => {
    render(<ReviewsContent selectedTab="sent" />);

    expect(mockUseGetMyReviews).toHaveBeenCalledWith({ type: "SENT" });
    expect(screen.getByTestId("review-card")).toHaveAttribute("data-hide-menu", "false");
  });

  it("보낸 후기 목록이 비어 있으면 빈 상태를 렌더한다", () => {
    mockUseGetMyReviews.mockReturnValue({
      ...baseQueryResult,
      data: { reviewList: [], reviewCount: 0 },
    } as unknown as ReturnType<typeof useGetMyReviews>);

    render(<ReviewsContent selectedTab="sent" />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("아직 보낸 후기가 없어요")).toBeInTheDocument();
  });

  it("숨긴 후기 탭은 기존 빈 상태를 렌더한다", () => {
    render(<ReviewsContent selectedTab="hidden" />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("숨긴 후기가 없어요")).toBeInTheDocument();
  });

  it("첫 페이지를 불러오는 동안 후기 목록 스켈레톤을 렌더한다", () => {
    mockUseGetMyReviews.mockReturnValue({
      ...baseQueryResult,
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useGetMyReviews>);

    const { container } = render(<ReviewsContent selectedTab="received" />);

    expect(container.querySelectorAll(".skeleton-animation")).not.toHaveLength(0);
  });
});
