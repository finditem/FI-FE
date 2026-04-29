import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewMoreReply from "./ViewMoreReply";

describe("ViewMoreReply", () => {
  it("text와 답글 쓰기 버튼이 보입니다", () => {
    render(<ViewMoreReply text="답글 3개" />);
    expect(screen.getByText("답글 3개")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "답글 쓰기" })).toBeInTheDocument();
  });

  it("첫 버튼 클릭 시 replyComponent가 펼쳐집니다", async () => {
    const user = userEvent.setup();
    render(
      <ViewMoreReply text="답글 더보기" replyComponent={<div data-testid="replies">목록</div>} />
    );
    expect(screen.queryByTestId("replies")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "답글 더보기" }));
    expect(screen.getByTestId("replies")).toBeInTheDocument();
  });

  it("답글 쓰기 클릭 시 onWriteReply가 호출됩니다", async () => {
    const user = userEvent.setup();
    const onWriteReply = jest.fn();
    render(<ViewMoreReply text="답글" onWriteReply={onWriteReply} />);
    await user.click(screen.getByRole("button", { name: "답글 쓰기" }));
    expect(onWriteReply).toHaveBeenCalled();
  });
});
