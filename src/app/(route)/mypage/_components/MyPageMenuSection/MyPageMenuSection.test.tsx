import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyPageMenuSection from "./MyPageMenuSection";

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

jest.mock("@/hooks", () => ({
  useLogout: jest.fn().mockReturnValue({
    handleLogout: jest.fn(),
    isPending: false,
  }),
}));

describe("MyPageMenuSection", () => {
  it("로그인 상태에서 5개 섹션이 모두 렌더된다", () => {
    render(<MyPageMenuSection isUserLogin={true} />);
    expect(screen.getByText("내 활동")).toBeInTheDocument();
    expect(screen.getByText("알림")).toBeInTheDocument();
    expect(screen.getByText("신고/문의")).toBeInTheDocument();
    expect(screen.getByText("계정 관리")).toBeInTheDocument();
    expect(screen.getByText("서비스 정책")).toBeInTheDocument();
  });

  it("비로그인 상태에서 '서비스 정책' 섹션이 렌더되지 않는다", () => {
    render(<MyPageMenuSection isUserLogin={false} />);
    expect(screen.queryByText("서비스 정책")).not.toBeInTheDocument();
  });

  it("비로그인 상태에서 나머지 4개 섹션은 렌더된다", () => {
    render(<MyPageMenuSection isUserLogin={false} />);
    expect(screen.getByText("내 활동")).toBeInTheDocument();
    expect(screen.getByText("알림")).toBeInTheDocument();
    expect(screen.getByText("신고/문의")).toBeInTheDocument();
    expect(screen.getByText("계정 관리")).toBeInTheDocument();
  });
});
