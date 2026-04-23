import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CommentFooter from "./CommentFooter";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
  formatCappedNumber: (n: number, cap: number) => (n > cap ? `${cap}+` : String(n)),
}));

describe("<CommentFooter />", () => {
  const defaultProps = {
    footerData: {
      id: 1,
      likeCount: 5,
      isLike: false,
      deleted: false,
    },
    isReply: true,
    isGuest: false,
    isReplyFormOpen: false,
    setIsReplyFormOpen: jest.fn(),
    queryKey: [],
    onFavoriteComment: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("좋아요 수와 답글 작성 버튼을 렌더링합니다.", () => {
    render(<CommentFooter {...defaultProps} />);
    expect(screen.getByText(/좋아요 5/)).toBeInTheDocument();
    expect(screen.getByText("답글 작성")).toBeInTheDocument();
  });

  it("좋아요 버튼 클릭 시 onFavoriteComment가 호출됩니다.", async () => {
    render(<CommentFooter {...defaultProps} />);
    await userEvent.click(screen.getByText(/좋아요 5/));
    expect(defaultProps.onFavoriteComment).toHaveBeenCalledWith(1, false, expect.any(Array));
  });

  it("답글 작성 버튼 클릭 시 setIsReplyFormOpen이 호출됩니다.", async () => {
    render(<CommentFooter {...defaultProps} />);
    await userEvent.click(screen.getByText("답글 작성"));
    expect(defaultProps.setIsReplyFormOpen).toHaveBeenCalledWith(true);
  });
});
