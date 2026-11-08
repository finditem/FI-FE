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
    // "계정 설정"은 섹션 제목과 메뉴 항목에 함께 쓰인다.
    expect(screen.getAllByText("계정 설정")).toHaveLength(2);
    expect(screen.getByText("서비스 정책")).toBeInTheDocument();
  });

  it("로그인 상태에서 서비스 정책의 모든 항목과 로그아웃이 렌더된다", () => {
    render(<MyPageMenuSection isUserLogin={true} />);
    expect(screen.getByRole("link", { name: /공지사항/ })).toHaveAttribute("href", "/notice");
    expect(screen.getByText("서비스 소개")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByText("서비스 이용 약관")).toBeInTheDocument();
    expect(screen.getByText("마케팅 수신 약관")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 활용 동의서")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그아웃/ })).toBeInTheDocument();
  });

  it("비로그인 상태에서 서비스 정책 섹션에는 공지사항만 렌더된다", () => {
    render(<MyPageMenuSection isUserLogin={false} />);
    expect(screen.getByText("서비스 정책")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /공지사항/ })).toHaveAttribute("href", "/notice");
    expect(screen.queryByText("서비스 소개")).not.toBeInTheDocument();
    expect(screen.queryByText("개인정보처리방침")).not.toBeInTheDocument();
    expect(screen.queryByText("서비스 이용 약관")).not.toBeInTheDocument();
    expect(screen.queryByText("마케팅 수신 약관")).not.toBeInTheDocument();
    expect(screen.queryByText("콘텐츠 활용 동의서")).not.toBeInTheDocument();
  });

  it("비로그인 상태에서 나머지 4개 섹션은 렌더되고 로그아웃은 렌더되지 않는다", () => {
    render(<MyPageMenuSection isUserLogin={false} />);
    expect(screen.getByText("내 활동")).toBeInTheDocument();
    expect(screen.getByText("알림")).toBeInTheDocument();
    expect(screen.getByText("신고/문의")).toBeInTheDocument();
    expect(screen.getAllByText("계정 설정")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /로그아웃/ })).not.toBeInTheDocument();
  });
});
