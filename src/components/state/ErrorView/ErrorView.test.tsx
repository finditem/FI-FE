import { render, screen } from "@testing-library/react";
import ErrorView from "./ErrorView";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/common", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid="icon" data-name={name} />,
  Button: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ErrorView", () => {
  const defaultProps = {
    iconName: "NotFound" as const,
    code: "404",
    title: "페이지를 찾을 수 없습니다.",
    description: "요청하신 페이지를 찾을 수 없습니다.",
  };

  it("에러 코드를 렌더링한다", () => {
    render(<ErrorView {...defaultProps} />);

    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("에러 제목을 렌더링한다", () => {
    render(<ErrorView {...defaultProps} />);

    expect(screen.getByText("페이지를 찾을 수 없습니다.")).toBeInTheDocument();
  });

  it("에러 설명을 렌더링한다", () => {
    render(<ErrorView {...defaultProps} />);

    expect(screen.getByText("요청하신 페이지를 찾을 수 없습니다.")).toBeInTheDocument();
  });

  it("전달된 iconName을 렌더링한다", () => {
    render(<ErrorView {...defaultProps} />);

    expect(screen.getByTestId("icon")).toHaveAttribute("data-name", "NotFound");
  });

  it("ServerError 아이콘을 렌더링한다", () => {
    render(<ErrorView {...defaultProps} iconName="ServerError" />);

    expect(screen.getByTestId("icon")).toHaveAttribute("data-name", "ServerError");
  });

  it("홈으로 이동하는 링크를 렌더링한다", () => {
    render(<ErrorView {...defaultProps} />);

    expect(screen.getByRole("link", { name: "홈으로 이동하기" })).toHaveAttribute("href", "/");
  });

  it("description에 ReactNode를 렌더링한다", () => {
    const { container } = render(
      <ErrorView
        {...defaultProps}
        description={
          <>
            첫 번째 줄 <br />두 번째 줄
          </>
        }
      />
    );

    const descriptionEl = container.querySelector("p");
    expect(descriptionEl).toHaveTextContent("첫 번째 줄");
    expect(descriptionEl).toHaveTextContent("두 번째 줄");
  });
});
