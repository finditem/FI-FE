import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PostReportBlockActions from "./PostReportBlockActions";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

describe("<PostReportBlockActions />", () => {
  it("게시글 신고하기 버튼을 렌더링합니다.", () => {
    render(<PostReportBlockActions onOpenReport={jest.fn()} onOpenBlock={jest.fn()} />);
    expect(screen.getByText("게시글 신고하기")).toBeInTheDocument();
  });

  it("작성자 차단하기 버튼을 렌더링합니다.", () => {
    render(<PostReportBlockActions onOpenReport={jest.fn()} onOpenBlock={jest.fn()} />);
    expect(screen.getByText("작성자 차단하기")).toBeInTheDocument();
  });

  it("신고 버튼 클릭 시 onOpenReport가 호출됩니다.", async () => {
    const onOpenReport = jest.fn();
    render(<PostReportBlockActions onOpenReport={onOpenReport} onOpenBlock={jest.fn()} />);
    await userEvent.click(screen.getByTestId("post-report-button"));
    expect(onOpenReport).toHaveBeenCalledTimes(1);
  });

  it("차단 버튼 클릭 시 onOpenBlock이 호출됩니다.", async () => {
    const onOpenBlock = jest.fn();
    render(<PostReportBlockActions onOpenReport={jest.fn()} onOpenBlock={onOpenBlock} />);
    await userEvent.click(screen.getByTestId("post-block-button"));
    expect(onOpenBlock).toHaveBeenCalledTimes(1);
  });

  it("신고 버튼에 UserReport 아이콘이 렌더링됩니다.", () => {
    render(<PostReportBlockActions onOpenReport={jest.fn()} onOpenBlock={jest.fn()} />);
    expect(screen.getByTestId("icon-UserReport")).toBeInTheDocument();
  });

  it("차단 버튼에 UserBlock 아이콘이 렌더링됩니다.", () => {
    render(<PostReportBlockActions onOpenReport={jest.fn()} onOpenBlock={jest.fn()} />);
    expect(screen.getByTestId("icon-UserBlock")).toBeInTheDocument();
  });
});
