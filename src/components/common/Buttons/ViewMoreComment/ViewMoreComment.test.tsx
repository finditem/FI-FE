import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewMoreComment from "./ViewMoreComment";

describe("ViewMoreComment", () => {
  it("count가 0 이하면 렌더하지 않습니다", () => {
    const { container } = render(
      <ViewMoreComment count={0} onClick={jest.fn()}>
        내용
      </ViewMoreComment>
    );
    expect(container.firstChild).toBeNull();
  });

  it("댓글 더보기 문구와 개수가 보입니다", () => {
    render(
      <ViewMoreComment count={3} onClick={jest.fn()}>
        생략
      </ViewMoreComment>
    );
    expect(screen.getByRole("button", { name: "댓글 더 보기" })).toHaveTextContent("댓글");
    expect(screen.getByText("3개")).toBeInTheDocument();
  });

  it("isThreadItem이면 답글 문구를 씁니다", () => {
    render(
      <ViewMoreComment count={2} isThreadItem onClick={jest.fn()}>
        생략
      </ViewMoreComment>
    );
    expect(screen.getByRole("button", { name: "댓글 더 보기" })).toHaveTextContent("답글");
  });

  it("클릭 시 onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <ViewMoreComment count={1} onClick={onClick}>
        생략
      </ViewMoreComment>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
