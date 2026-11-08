import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyPageProfile from "./MyPageProfile";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/common", () => ({
  ProfileAvatar: ({ alt, src }: { alt: string; src?: string | null }) => (
    <div aria-label={alt} data-src={src ?? "null"} />
  ),
  Button: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("MyPageProfile", () => {
  it("userData가 없으면 '로그인 시 이용 가능합니다.' 텍스트가 표시된다", () => {
    render(<MyPageProfile />);
    expect(screen.getByText("로그인 시 이용 가능합니다.")).toBeInTheDocument();
  });

  it("userData가 없으면 '로그인' 버튼이 /login 링크로 렌더된다", () => {
    render(<MyPageProfile />);
    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "/login");
  });

  it("userData가 있으면 닉네임과 이메일이 표시된다", () => {
    render(<MyPageProfile userData={{ nickname: "테스트유저", email: "test@example.com" }} />);
    expect(screen.getByText("테스트유저")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("userData가 있으면 '프로필 수정' 버튼이 /mypage/profile 링크로 렌더된다", () => {
    render(<MyPageProfile userData={{ nickname: "테스트유저", email: "test@example.com" }} />);
    expect(screen.getByRole("link", { name: "프로필 수정" })).toHaveAttribute(
      "href",
      "/mypage/profile"
    );
  });

  it("profileImg가 유효한 URL이면 ProfileAvatar에 그대로 전달된다", () => {
    render(
      <MyPageProfile
        userData={{
          nickname: "테스트유저",
          email: "test@example.com",
          profileImg: "https://example.com/profile.png",
        }}
      />
    );
    expect(screen.getByLabelText("테스트유저")).toHaveAttribute(
      "data-src",
      "https://example.com/profile.png"
    );
  });

  it.each(["0", "", "abc", "123"])(
    "profileImg가 이미지 값이 아니면(%s) ProfileAvatar에 src가 전달되지 않는다",
    (invalidValue) => {
      render(
        <MyPageProfile
          userData={{
            nickname: "테스트유저",
            email: "test@example.com",
            profileImg: invalidValue,
          }}
        />
      );
      expect(screen.getByLabelText("테스트유저")).toHaveAttribute("data-src", "null");
    }
  );
});
