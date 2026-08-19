import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmptyChatRoom from "./EmptyChatRoom";

jest.mock("@/components/common", () => ({
  Icon: ({ name, size, ...rest }: any) => (
    <span data-testid={`icon-${name}`} data-size={size} {...rest} />
  ),
}));

describe("EmptyChatRoom", () => {
  it("스크린 리더용 제목이 렌더링됩니다", () => {
    render(<EmptyChatRoom postMode="find" />);

    const heading = screen.getByRole("heading", { name: "빈 채팅 안내 화면" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("sr-only");
  });

  it("postMode가 find일 때 ChatFind 아이콘이 렌더링됩니다", () => {
    render(<EmptyChatRoom postMode="find" />);

    const icon = screen.getByTestId("icon-ChatFind");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("data-size", "80");
  });

  it("postMode가 find일 때 올바른 도움말 텍스트가 렌더링됩니다", () => {
    const { container } = render(<EmptyChatRoom postMode="find" />);

    const helpText = container.querySelector("p");
    expect(helpText).toHaveTextContent("내 물건이 맞는지 확인해보세요.");
    expect(helpText).toHaveTextContent("발견자에게 메시지를 보내세요.");
  });

  it("postMode가 lost일 때 ChatLost 아이콘이 렌더링됩니다", () => {
    render(<EmptyChatRoom postMode="lost" />);

    const icon = screen.getByTestId("icon-ChatLost");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("data-size", "80");
  });

  it("postMode가 lost일 때 올바른 도움말 텍스트가 렌더링됩니다", () => {
    const { container } = render(<EmptyChatRoom postMode="lost" />);

    const helpText = container.querySelector("p");
    expect(helpText).toHaveTextContent("이 분실물을 주우셨나요?");
    expect(helpText).toHaveTextContent("주인에게 먼저 연락해보세요.");
  });

  it("find 모드일 때 모든 요소가 올바르게 렌더링됩니다", () => {
    const { container } = render(<EmptyChatRoom postMode="find" />);

    // 스크린 리더용 제목
    expect(screen.getByRole("heading", { name: "빈 채팅 안내 화면" })).toBeInTheDocument();

    // 아이콘
    expect(screen.getByTestId("icon-ChatFind")).toBeInTheDocument();

    // 도움말 텍스트
    const helpText = container.querySelector("p");
    expect(helpText).toHaveTextContent("내 물건이 맞는지 확인해보세요.");
    expect(helpText).toHaveTextContent("발견자에게 메시지를 보내세요.");
  });

  it("lost 모드일 때 모든 요소가 올바르게 렌더링됩니다", () => {
    const { container } = render(<EmptyChatRoom postMode="lost" />);

    // 스크린 리더용 제목
    expect(screen.getByRole("heading", { name: "빈 채팅 안내 화면" })).toBeInTheDocument();

    // 아이콘
    expect(screen.getByTestId("icon-ChatLost")).toBeInTheDocument();

    // 도움말 텍스트
    const helpText = container.querySelector("p");
    expect(helpText).toHaveTextContent("이 분실물을 주우셨나요?");
    expect(helpText).toHaveTextContent("주인에게 먼저 연락해보세요.");
  });

  it("도움말 텍스트가 줄바꿈으로 렌더링됩니다", () => {
    const { container } = render(<EmptyChatRoom postMode="find" />);

    const helpText = container.querySelector("p");
    expect(helpText).toHaveClass("whitespace-pre-line");
    expect(helpText?.textContent).toBe(
      "내 물건이 맞는지 확인해보세요.\n발견자에게 메시지를 보내세요."
    );
  });
});
