import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FloatingButton from "./FloatingButton";

describe("FloatingButton", () => {
  it("기본 mode(post)에서 aria-label과 버튼이 렌더링됩니다", () => {
    render(<FloatingButton ariaLabel="글쓰기" />);
    expect(screen.getByRole("button", { name: "글쓰기" })).toBeInTheDocument();
  });

  it("notice mode에서도 동일하게 접근 가능한 버튼입니다", () => {
    render(<FloatingButton ariaLabel="공지" mode="notice" />);
    expect(screen.getByRole("button", { name: "공지" })).toBeInTheDocument();
  });

  it("onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<FloatingButton ariaLabel="FAB" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
