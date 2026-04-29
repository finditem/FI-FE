import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleButton from "./ToggleButton";

describe("ToggleButton", () => {
  it("toggleState에 따라 aria-checked가 설정됩니다", () => {
    const { rerender } = render(<ToggleButton toggleState={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-checked", "false");

    rerender(<ToggleButton toggleState />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-checked", "true");
  });

  it("disabled이면 aria-checked는 false입니다", () => {
    render(<ToggleButton toggleState disabled />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("클릭 시 onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<ToggleButton toggleState={false} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
