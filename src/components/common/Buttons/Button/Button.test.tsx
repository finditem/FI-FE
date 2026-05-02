import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("children이 렌더링됩니다", () => {
    render(<Button>저장</Button>);
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("loading이면 스피너 역할의 로딩 아이콘이 보이고 children은 보이지 않습니다", () => {
    render(
      <Button loading icon={{ name: "Search" }}>
        검색
      </Button>
    );
    expect(screen.queryByText("검색")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("loading일 때 클릭해도 onClick이 호출되지 않습니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button loading onClick={onClick}>
        로딩
      </Button>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ignoreBase와 className만 넘기면 기본 variant 클래스 없이 className이 적용됩니다", () => {
    render(
      <Button ignoreBase className="custom-only">
        커스텀
      </Button>
    );
    const btn = screen.getByRole("button", { name: "커스텀" });
    expect(btn.className).toBe("custom-only");
  });
});
