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
  it("찾길 후기, 찜한 장소, 채팅 목록 탭이 렌더된다", () => {
    render(<MyPageIconNav />);
    expect(screen.getByText("찾길 후기")).toBeInTheDocument();
    expect(screen.getByText("찜한 장소")).toBeInTheDocument();
    expect(screen.getByText("채팅 목록")).toBeInTheDocument();
  });

  it("공지사항 탭은 서비스 정책으로 옮겨져 렌더되지 않는다", () => {
    render(<MyPageIconNav />);
    expect(screen.queryByText("공지사항")).not.toBeInTheDocument();
  });

  it("채팅 목록 링크가 /chat을 가리킨다", () => {
    render(<MyPageIconNav />);
    expect(screen.getByRole("link", { name: /채팅 목록/ })).toHaveAttribute("href", "/chat");
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
