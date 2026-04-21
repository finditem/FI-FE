import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CommentItem from "./CommentItem";

jest.mock("@/api/fetch/comment", () => ({
  useGetRepliesPostsComments: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
  ViewMoreComment: ({ onClick, count }: any) => (
    <button data-testid="view-more-comment" onClick={onClick}>
      더보기 {count}
    </button>
  ),
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

jest.mock("./_internal", () => ({
  CommentBody: ({ bodyData }: any) => <div data-testid="comment-body">{bodyData.content}</div>,
  CommentMeta: ({ data }: any) => <div data-testid="comment-meta">{data.authorName}</div>,
  CommentActions: ({ setViewReply, replyCount }: any) => (
    <button data-testid="comment-actions" onClick={() => setViewReply(true)}>
      답글 {replyCount}
    </button>
  ),
  CommentFooter: ({ setIsReplyFormOpen }: any) => (
    <button data-testid="comment-footer" onClick={() => setIsReplyFormOpen(true)}>
      답글 달기
    </button>
  ),
  ReplyForm: ({ onSubmit }: any) => (
    <div data-testid="reply-form">
      <button onClick={() => onSubmit("내용", null)}>제출</button>
    </div>
  ),
}));

const mockFetchReplies = jest.fn().mockReturnValue({
  data: undefined,
  fetchNextPage: jest.fn(),
});

const mockComment = {
  id: 1,
  content: "테스트 댓글입니다.",
  createdAt: "2024-01-01T00:00:00Z",
  deleted: false,
  canDelete: true,
  likeCount: 5,
  isLike: false,
  childCommentCount: 2,
  imageList: [],
  depth: 0,
  authorResponse: {
    userId: 100,
    nickName: "테스트유저",
    profileImage: "",
  },
};

const defaultProps = {
  data: mockComment as any,
  postId: 1,
  useFetchReplies: mockFetchReplies,
  onDeleteComment: jest.fn(),
  onFavoriteComment: jest.fn(),
};

describe("<CommentItem />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("댓글 본문을 렌더링합니다.", () => {
    render(<CommentItem {...defaultProps} />);
    expect(screen.getByTestId("comment-body")).toBeInTheDocument();
    expect(screen.getByText("테스트 댓글입니다.")).toBeInTheDocument();
  });

  it("작성자 정보를 렌더링합니다.", () => {
    render(<CommentItem {...defaultProps} />);
    expect(screen.getByTestId("comment-meta")).toBeInTheDocument();
    expect(screen.getByText("테스트유저")).toBeInTheDocument();
  });

  it("level이 nestedReply이면 CommentReplyIcon을 렌더링합니다.", () => {
    render(<CommentItem {...defaultProps} level="nestedReply" />);
    expect(screen.getByTestId("icon-CommentReplyIcon")).toBeInTheDocument();
  });

  it("level이 comment이면 CommentReplyIcon을 렌더링하지 않습니다.", () => {
    render(<CommentItem {...defaultProps} level="comment" />);
    expect(screen.queryByTestId("icon-CommentReplyIcon")).not.toBeInTheDocument();
  });

  it("level이 reply이면 CommentReplyIcon을 렌더링하지 않습니다.", () => {
    render(<CommentItem {...defaultProps} level="reply" />);
    expect(screen.queryByTestId("icon-CommentReplyIcon")).not.toBeInTheDocument();
  });

  it("CommentFooter 클릭 시 ReplyForm이 렌더링됩니다.", async () => {
    render(<CommentItem {...defaultProps} />);
    await userEvent.click(screen.getByTestId("comment-footer"));
    expect(screen.getByTestId("reply-form")).toBeInTheDocument();
  });

  it("level이 nestedReply이면 ReplyForm이 열리지 않습니다.", async () => {
    render(<CommentItem {...defaultProps} level="nestedReply" />);
    await userEvent.click(screen.getByTestId("comment-footer"));
    expect(screen.queryByTestId("reply-form")).not.toBeInTheDocument();
  });

  it("답글 버튼 클릭 시 답글 조회가 활성화됩니다.", async () => {
    render(<CommentItem {...defaultProps} />);
    await userEvent.click(screen.getByTestId("comment-actions"));
    expect(mockFetchReplies).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });
});
