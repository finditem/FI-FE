import { render, screen } from "@testing-library/react";
import AdminMenuSection from "./AdminMenuSection";

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : href?.pathname} {...rest}>
      {children}
    </a>
  );
});

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
}));

jest.mock("../_internal", () => ({
  AdminLogoutButton: () => <button data-testid="logout">로그아웃</button>,
}));

jest.mock("../../_constants/ADMIN_NAV_SECTIONS", () => ({
  ADMIN_NAV_SECTIONS: [
    {
      id: "report",
      label: "신고 관리",
      items: [
        { href: "/admin/report", title: "신고 목록" },
        { href: "/admin/inquiry", title: "문의 목록" },
      ],
    },
    {
      id: "account",
      label: "계정",
      items: [{ href: "/admin/profile", title: "프로필" }],
    },
  ],
}));

describe("AdminMenuSection", () => {
  it("메뉴 섹션과 링크 렌더", () => {
    render(<AdminMenuSection />);

    expect(screen.getByRole("navigation", { name: "관리자 메뉴" })).toBeInTheDocument();

    expect(screen.getByText("신고 관리")).toBeInTheDocument();
    expect(screen.getByText("계정")).toBeInTheDocument();

    const reportLink = screen.getByRole("link", { name: "신고 목록" });
    expect(reportLink).toHaveAttribute("href", "/admin/report");

    const inquiryLink = screen.getByRole("link", { name: "문의 목록" });
    expect(inquiryLink).toHaveAttribute("href", "/admin/inquiry");

    const profileLink = screen.getByRole("link", { name: "프로필" });
    expect(profileLink).toHaveAttribute("href", "/admin/profile");

    expect(screen.getAllByTestId("icon-ArrowRightSmall").length).toBe(3);
  });

  it("하단 logout footer 렌더", () => {
    render(<AdminMenuSection />);

    expect(screen.getByTestId("logout")).toBeInTheDocument();
  });

  it("섹션 사이 구분선 렌더", () => {
    const { container } = render(<AdminMenuSection />);

    const hrs = container.querySelectorAll("hr");
    expect(hrs.length).toBe(1);
  });
});
