import { render, screen } from "@testing-library/react";
import NoticeDetailHeader from "./NoticeDetailHeader";
import { ReactNode } from "react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const BACK_PATHS = ["/find", "/lost", "/notice?tab=notice", "/notice?tab=customer"] as const;

describe("NoticeDetailHeader", () => {
  it.each(BACK_PATHS)("backPath가 %s인 뒤로가기 링크를 렌더합니다", (backPath) => {
    render(<NoticeDetailHeader backPath={backPath} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", backPath);
  });

  it("banner 역할의 헤더를 렌더합니다", () => {
    render(<NoticeDetailHeader backPath="/find" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
