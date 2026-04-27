import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KebabMenuButton from "./KebabMenuButton";

describe("KebabMenuButton", () => {
  it("aria-label이 버튼에 반영됩니다", () => {
    render(<KebabMenuButton ariaLabel="메뉴 열기" />);
    expect(screen.getByRole("button", { name: "메뉴 열기" })).toBeInTheDocument();
  });

  it("onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<KebabMenuButton ariaLabel="케밥" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
