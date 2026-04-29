import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Bookmark from "./Bookmark";

describe("Bookmark", () => {
  it("aria-label 기본값과 aria-pressed가 isActive에 맞게 설정됩니다", () => {
    const { rerender } = render(<Bookmark isActive={false} />);
    const btn = screen.getByRole("button", { name: "즐겨찾기 버튼" });
    expect(btn).toHaveAttribute("aria-pressed", "false");

    rerender(<Bookmark isActive ariaLabel="북마크" />);
    expect(screen.getByRole("button", { name: "북마크" })).toHaveAttribute("aria-pressed", "true");
  });

  it("활성일 때 북마크용 클래스가 적용됩니다", () => {
    render(<Bookmark isActive />);
    expect(document.querySelector(".text-system-bookmark")).toBeInTheDocument();
  });

  it("비활성일 때 비활성 별 색 클래스가 적용됩니다", () => {
    render(<Bookmark isActive={false} />);
    expect(document.querySelector(".text-neutralInversed-strong-pressed")).toBeInTheDocument();
  });

  it("onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Bookmark isActive={false} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
