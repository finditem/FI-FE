import { render, screen } from "@testing-library/react";
import MypageCommentsContent from "./MypageCommentsContent";
import { useGetUserComments } from "@/api/fetch/user/api/useGetUserComments";
import { useFilterParams } from "@/hooks/domain";
import { useInfiniteScroll } from "@/hooks";
import { useToast } from "@/context/ToastContext";
import { useSearchParams } from "next/navigation";

jest.mock("@/api/fetch/user/api/useGetUserComments");
jest.mock("@/hooks/domain");
jest.mock("@/hooks");
jest.mock("@/context/ToastContext");
jest.mock("next/navigation");

jest.mock("@/components/domain", () => ({
  CommentCard: ({ data }: { data: any }) => <li data-testid="comment-card">{data.content}</li>,
  MypageEmptyUI: ({ pageType }: { pageType: string }) => (
    <div data-testid="empty-ui">{pageType} empty state</div>
  ),
}));

jest.mock("@/components/state", () => ({
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
}));

describe("MypageCommentsContent", () => {
  const mockAddToast = jest.fn();
  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useToast as jest.Mock).mockReturnValue({ addToast: mockAddToast });
    (useFilterParams as jest.Mock).mockReturnValue({
      startDate: "",
      endDate: "",
      simpleSort: "LATEST",
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    (useInfiniteScroll as jest.Mock).mockReturnValue({ ref: jest.fn() });
  });

  it("로딩 중일 때 LoadingState가 렌더된다", () => {
    (useGetUserComments as jest.Mock).mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    render(<MypageCommentsContent />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("에러 발생 시 토스트 메시지를 띄운다", () => {
    (useGetUserComments as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    render(<MypageCommentsContent />);
    expect(mockAddToast).toHaveBeenCalledWith("목록을 불러오는데 실패했어요", "error");
  });

  it("데이터가 비어있을 때 MypageEmptyUI를 렌더한다", () => {
    (useGetUserComments as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    render(<MypageCommentsContent />);
    expect(screen.getByTestId("empty-ui")).toBeInTheDocument();
  });

  it("데이터가 있을 때 댓글 목록을 렌더한다", () => {
    const mockData = [
      { commentId: 1, content: "테스트 댓글 1" },
      { commentId: 2, content: "테스트 댓글 2" },
    ];

    (useGetUserComments as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      hasNextPage: false,
    });

    render(<MypageCommentsContent />);
    const commentCards = screen.getAllByTestId("comment-card");
    expect(commentCards).toHaveLength(2);
    expect(screen.getByText("테스트 댓글 1")).toBeInTheDocument();
    expect(screen.getByText("테스트 댓글 2")).toBeInTheDocument();
  });

  it("다음 페이지가 있을 때 무한 스크롤 감지 요소가 렌더된다", () => {
    (useGetUserComments as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [{ commentId: 1, content: "댓글" }],
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    const { container } = render(<MypageCommentsContent />);
    const scrollRef = container.querySelector(".h-10");
    expect(scrollRef).toBeInTheDocument();
  });

  it("검색 키워드가 있을 때 해당 키워드로 API를 호출한다", () => {
    const mockKeyword = "지갑";
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(mockKeyword),
    });

    render(<MypageCommentsContent />);

    expect(useGetUserComments).toHaveBeenCalledWith(
      expect.objectContaining({
        keyword: mockKeyword,
      })
    );
  });
});
