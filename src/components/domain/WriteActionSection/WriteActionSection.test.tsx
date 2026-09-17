import { render, screen } from "@testing-library/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import WriteActionSection from "./WriteActionSection";

const ButtonMock = jest.fn(
  ({
    children,
    className,
    ...rest
  }: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="submit-button" className={className ?? ""} {...rest}>
      {children}
    </button>
  )
);

jest.mock("@/components/common", () => ({
  Button: (props: any) => ButtonMock(props),
}));

describe("WriteActionSection", () => {
  beforeEach(() => {
    ButtonMock.mockClear();
  });

  it("섹션과 제출 버튼이 렌더링되어야 합니다", () => {
    render(<WriteActionSection disabled={false} />);

    expect(screen.getByRole("button", { name: "작성 완료" })).toBeInTheDocument();

    const button = screen.getByTestId("submit-button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("disabled=false일 때 버튼이 비활성화되지 않아야 합니다", () => {
    render(<WriteActionSection disabled={false} />);

    expect(ButtonMock).toHaveBeenCalled();
    const props = ButtonMock.mock.calls[0][0];
    expect(props.disabled).toBe(false);
  });

  it("disabled=true일 때 버튼이 비활성화되어야 합니다", () => {
    render(<WriteActionSection disabled={true} />);

    expect(ButtonMock).toHaveBeenCalled();
    const props = ButtonMock.mock.calls[0][0];
    expect(props.disabled).toBe(true);
  });

  it("label을 전달하면 기본 텍스트 대신 label이 표시되어야 합니다", () => {
    render(<WriteActionSection disabled={true} label="180초 후 다시 시도" />);

    expect(screen.getByRole("button", { name: "180초 후 다시 시도" })).toBeInTheDocument();
    expect(screen.queryByText("작성 완료")).not.toBeInTheDocument();
  });

  it("isRateLimited가 true이면 버튼에 회색 disabled 톤 클래스가 추가되어야 합니다", () => {
    render(<WriteActionSection disabled={true} isRateLimited={true} />);

    const button = screen.getByTestId("submit-button");
    expect(button.className).toContain("disabled:!bg-fill-neutralInversed-normal-disabled");
    expect(button.className).toContain("disabled:!text-neutralInversed-strong-disabled");
  });

  it("isRateLimited가 없으면 회색 disabled 톤 클래스가 추가되지 않아야 합니다", () => {
    render(<WriteActionSection disabled={true} />);

    const button = screen.getByTestId("submit-button");
    expect(button.className).not.toContain("neutralInversed");
  });
});
