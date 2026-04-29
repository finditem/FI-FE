import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CommentActions from "./CommentActions";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
  formatCappedNumber: (n: number, cap: number) => (n > cap ? `${cap}+` : String(n)),
}));

describe("<CommentActions />", () => {
  const defaultProps = {
    isThreadItem: false,
    viewReply: false,
    setViewReply: jest.fn(),
    isReplyFormOpen: false,
    setIsReplyFormOpen: jest.fn(),
    isGuest: false,
    replyCount: 5,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("답글 보기 개수가 올바르게 표시됩니다.", () => {
    render(<CommentActions {...defaultProps} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(/개/)).toBeInTheDocument();
  });

  it("답글수 영역 클릭 시 setViewReply가 호출됩니다.", async () => {
    render(<CommentActions {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    expect(defaultProps.setViewReply).toHaveBeenCalled();
  });

  it("답글 작성 클릭 시 setIsReplyFormOpen이 호출됩니다.", async () => {
    render(<CommentActions {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[1]);
    expect(defaultProps.setIsReplyFormOpen).toHaveBeenCalled();
  });
});
