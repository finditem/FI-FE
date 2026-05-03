import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyPageIconNav from "./MyPageIconNav";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/common", () => ({
  Icon: () => <span />,
}));

describe("MyPageIconNav", () => {
  it("공지사항, 채팅목록 탭이 렌더된다", () => {
    render(<MyPageIconNav />);
    expect(screen.getByText("공지사항")).toBeInTheDocument();
    expect(screen.getByText("채팅목록")).toBeInTheDocument();
  });

  it("공지사항 링크가 /notice를 가리킨다", () => {
    render(<MyPageIconNav />);
    expect(screen.getByRole("link", { name: /공지사항/ })).toHaveAttribute("href", "/notice");
  });

  it("채팅목록 링크가 /chat을 가리킨다", () => {
    render(<MyPageIconNav />);
    expect(screen.getByRole("link", { name: /채팅목록/ })).toHaveAttribute("href", "/chat");
  });

  it("disabled=true이면 모든 링크에 pointer-events-none 클래스가 포함된다", () => {
    render(<MyPageIconNav disabled />);
    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveClass("pointer-events-none");
    });
  });

  it("disabled가 없으면 링크에 pointer-events-none 클래스가 없다", () => {
    render(<MyPageIconNav />);
    screen.getAllByRole("link").forEach((link) => {
      expect(link).not.toHaveClass("pointer-events-none");
    });
  });
});
