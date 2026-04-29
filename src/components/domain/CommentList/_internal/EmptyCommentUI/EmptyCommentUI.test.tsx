import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmptyCommentUI from "./EmptyCommentUI";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

describe("<EmptyCommentUI />", () => {
  it("아이콘과 안내 메시지를 렌더링합니다.", () => {
    render(<EmptyCommentUI />);
    expect(screen.getByTestId("icon-NoComments")).toBeInTheDocument();
    expect(screen.getByText(/아직 작성된 댓글이 없습니다/)).toBeInTheDocument();
    expect(screen.getByText(/첫 번째 댓글을 남겨보세요/)).toBeInTheDocument();
  });
});
