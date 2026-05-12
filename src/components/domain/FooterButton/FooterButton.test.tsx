import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FooterButton from "./FooterButton";

jest.mock("@/components/common/Buttons/Button/Button", () => ({
  __esModule: true,
  default: ({ children, disabled, onClick, type }: any) => (
    <button type={type ?? "button"} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("<FooterButton />", () => {
  it("children 텍스트가 렌더된다", () => {
    render(<FooterButton>완료</FooterButton>);
    expect(screen.getByText("완료")).toBeInTheDocument();
  });

  it("footer 요소 안에 렌더된다", () => {
    render(<FooterButton>완료</FooterButton>);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("클릭 시 onClick이 호출된다", () => {
    const onClick = jest.fn();
    render(<FooterButton onClick={onClick}>완료</FooterButton>);
    fireEvent.click(screen.getByText("완료"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled=true이면 버튼이 비활성화된다", () => {
    render(<FooterButton disabled>완료</FooterButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disabled=false이면 버튼이 활성화된다", () => {
    render(<FooterButton disabled={false}>완료</FooterButton>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("기본 type은 'button'이다", () => {
    render(<FooterButton>완료</FooterButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("type='submit'으로 재정의할 수 있다", () => {
    render(<FooterButton type="submit">완료</FooterButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
