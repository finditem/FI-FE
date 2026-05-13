import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FloatingInquiryButton from "./FloatingInquiryButton";

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

describe("FloatingInquiryButton", () => {
  it('"1:1 문의하기" 링크가 렌더된다', () => {
    render(<FloatingInquiryButton />);
    expect(screen.getByRole("link", { name: /1:1 문의하기/ })).toBeInTheDocument();
  });

  it("문의 작성 페이지로 연결된다", () => {
    render(<FloatingInquiryButton />);
    expect(screen.getByRole("link", { name: /1:1 문의하기/ })).toHaveAttribute(
      "href",
      "/inquiry-write"
    );
  });
});
