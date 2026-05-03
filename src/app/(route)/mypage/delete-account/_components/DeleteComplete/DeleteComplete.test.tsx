import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteComplete from "./DeleteComplete";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
  Icon: () => <span />,
}));

describe("DeleteComplete", () => {
  it("탈퇴 완료 메시지가 표시된다", () => {
    render(<DeleteComplete />);
    expect(screen.getByText("회원 탈퇴가 완료되었습니다.")).toBeInTheDocument();
  });

  it("재가입 불가 안내 문구가 표시된다", () => {
    render(<DeleteComplete />);
    expect(screen.getByText("동일한 이메일로 1주일간 재가입이 불가합니다.")).toBeInTheDocument();
  });

  it("'홈 화면으로 이동하기' 링크가 '/'로 연결된다", () => {
    render(<DeleteComplete />);
    expect(screen.getByRole("link", { name: "홈 화면으로 이동하기" })).toHaveAttribute("href", "/");
  });
});
