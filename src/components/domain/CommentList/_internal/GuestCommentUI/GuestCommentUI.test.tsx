import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GuestCommentUI from "./GuestCommentUI";

jest.mock("../../CommentItem", () => ({
  __esModule: true,
  default: ({ data }: any) => <li data-testid="mock-comment-item">{data.content}</li>,
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, href }: any) => (
    <a href={href} data-testid="mock-button">
      {children}
    </a>
  ),
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

describe("<GuestCommentUI />", () => {
  it("목업 댓글 목록과 안내 레이어를 렌더링합니다.", () => {
    render(<GuestCommentUI />);
    const items = screen.getAllByTestId("mock-comment-item");
    expect(items.length).toBeGreaterThan(0);
    expect(screen.getByText("로그인하고 댓글을 확인하세요.")).toBeInTheDocument();
    expect(screen.getByTestId("mock-button")).toHaveAttribute("href", "/login");
  });
});
