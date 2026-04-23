import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CommentList from "./CommentList";

jest.mock("./_internal", () => ({
  EmptyCommentUI: () => <div data-testid="empty-comment-ui" />,
  GuestCommentUI: () => <div data-testid="guest-comment-ui" />,
}));

jest.mock("./CommentItem", () => ({
  __esModule: true,
  default: ({ data }: any) => <li data-testid="comment-item">{data.id}</li>,
}));

jest.mock("@/components/common", () => ({
  ViewMoreComment: ({ onClick, count }: any) => (
    <button data-testid="view-more" onClick={onClick}>
      더보기 {count}
    </button>
  ),
}));

jest.mock("@/utils", () => ({
  formatCappedNumber: (n: number, cap: number) => (n > cap ? `${cap}+` : String(n)),
}));

jest.mock("@/api/fetch/comment", () => ({
  useGetRepliesPostsComments: jest.fn(),
}));

const mockFetchReplies = jest.fn().mockReturnValue({
  data: undefined,
  fetchNextPage: jest.fn(),
});

const baseComments = {
  totalCommentCount: 3,
  comments: [{ id: 1 }, { id: 2 }],
  hasNext: false,
  remainingCount: 0,
};

describe("<CommentList />", () => {
  const defaultProps = {
    postId: 1,
    onSubmit: jest.fn(),
    isPending: false,
    useFetchReplies: mockFetchReplies,
    onDeleteComment: jest.fn(),
    onFavoriteComment: jest.fn(),
  };

  it("isLoggedIn이 false이면 GuestCommentUI를 렌더링합니다.", () => {
    render(<CommentList {...defaultProps} isLoggedIn={false} />);
    expect(screen.getByTestId("guest-comment-ui")).toBeInTheDocument();
  });

  it("isLoggedIn이 true이고 comments가 없으면 null을 렌더링합니다.", () => {
    const { container } = render(<CommentList {...defaultProps} isLoggedIn={true} />);
    expect(container.firstChild).toBeNull();
  });

  it("댓글이 없으면 EmptyCommentUI를 렌더링합니다.", () => {
    render(
      <CommentList
        {...defaultProps}
        isLoggedIn={true}
        comments={{ ...baseComments, comments: [], totalCommentCount: 0 } as any}
      />
    );
    expect(screen.getByTestId("empty-comment-ui")).toBeInTheDocument();
  });

  it("댓글 목록을 렌더링합니다.", () => {
    render(<CommentList {...defaultProps} isLoggedIn={true} comments={baseComments as any} />);
    expect(screen.getAllByTestId("comment-item")).toHaveLength(2);
  });

  it("총 댓글 수를 헤더에 표시합니다.", () => {
    render(<CommentList {...defaultProps} isLoggedIn={true} comments={baseComments as any} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("hasNext가 true이면 ViewMoreComment를 렌더링합니다.", () => {
    render(
      <CommentList
        {...defaultProps}
        isLoggedIn={true}
        comments={{ ...baseComments, hasNext: true, remainingCount: 5 } as any}
      />
    );
    expect(screen.getByTestId("view-more")).toBeInTheDocument();
  });

  it("hasNext가 false이면 ViewMoreComment를 렌더링하지 않습니다.", () => {
    render(<CommentList {...defaultProps} isLoggedIn={true} comments={baseComments as any} />);
    expect(screen.queryByTestId("view-more")).not.toBeInTheDocument();
  });

  it("ViewMoreComment 클릭 시 onCommentLoadMore가 호출됩니다.", async () => {
    const onCommentLoadMore = jest.fn();
    render(
      <CommentList
        {...defaultProps}
        isLoggedIn={true}
        comments={{ ...baseComments, hasNext: true, remainingCount: 5 } as any}
        onCommentLoadMore={onCommentLoadMore}
      />
    );
    await userEvent.click(screen.getByTestId("view-more"));
    expect(onCommentLoadMore).toHaveBeenCalledTimes(1);
  });
});
