import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filter from "./Filter";

describe("Filter", () => {
  it("aria-label에 필터 접미사가 붙습니다", () => {
    render(
      <Filter ariaLabel="최신순" onSelected={false}>
        최신순
      </Filter>
    );
    expect(screen.getByRole("button", { name: "최신순 필터" })).toBeInTheDocument();
  });

  it("onSelected에 따라 선택 스타일 클래스가 달라집니다", () => {
    const { rerender } = render(
      <Filter ariaLabel="정렬" onSelected={false}>
        정렬
      </Filter>
    );
    expect(screen.getByRole("button")).toHaveClass("bg-fill-neutralInversed-normal-default");

    rerender(
      <Filter ariaLabel="정렬" onSelected>
        정렬
      </Filter>
    );
    expect(screen.getByRole("button")).toHaveClass(
      "bg-fill-neutralInversed-normal-enteredSelected"
    );
  });

  it("loading이면 스피너가 보이고 라벨 텍스트는 숨깁니다", () => {
    render(
      <Filter ariaLabel="필터" onSelected loading>
        로딩필터
      </Filter>
    );
    expect(screen.queryByText("로딩필터")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("클릭 시 onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Filter ariaLabel="필터" onSelected={false} onClick={onClick}>
        필터
      </Filter>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
