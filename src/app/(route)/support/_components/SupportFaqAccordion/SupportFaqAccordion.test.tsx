import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SupportFaqAccordion from "./SupportFaqAccordion";
import type { SupportTabKey } from "../SupportTab/_internal/SUPPORT_TABS";

type UseSupportTabQueryResult = {
  tab: SupportTabKey;
  updateTabQuery: jest.Mock;
};

const mockRouterReplace = jest.fn();

const mockUseSupportTabQuery = jest.fn(
  (): UseSupportTabQueryResult => ({
    tab: "all",
    updateTabQuery: jest.fn(),
  })
);

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/support",
}));

jest.mock("../SupportTab/_internal/useSupportTabQuery", () => ({
  useSupportTabQuery: () => mockUseSupportTabQuery(),
}));

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  motion: {
    div: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  },
}));

jest.mock("@/components/common", () => ({
  Icon: () => null,
  Chip: ({ label }: { label: string }) => <span data-testid="faq-chip">{label}</span>,
  Button: ({
    children,
    as: As,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    as?: React.ElementType;
    href?: string;
  } & Record<string, unknown>) =>
    As && href ? (
      <As href={href} {...rest}>
        {children}
      </As>
    ) : (
      <button type="button" {...rest}>
        {children}
      </button>
    ),
}));

describe("SupportFaqAccordion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouterReplace.mockClear();
    mockUseSupportTabQuery.mockImplementation(() => ({
      tab: "all",
      updateTabQuery: jest.fn(),
    }));
    window.location.hash = "";
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("선택한 탭의 FAQ 질문 목록이 렌더된다 (전체)", () => {
    render(<SupportFaqAccordion />);
    expect(screen.getByText("찾아줘 서비스는 어떤 플랫폼인가요?")).toBeInTheDocument();
    expect(screen.getByText("서비스 이용 중 문제가 발생하면 어떻게 하나요?")).toBeInTheDocument();
  });

  it("계정 탭이면 계정 카테고리 FAQ만 보인다", () => {
    mockUseSupportTabQuery.mockReturnValue({
      tab: "account",
      updateTabQuery: jest.fn(),
    });
    render(<SupportFaqAccordion />);
    expect(screen.getByText("회원가입은 어떻게 하나요?")).toBeInTheDocument();
    expect(screen.queryByText("찾아줘 서비스는 어떤 플랫폼인가요?")).not.toBeInTheDocument();
  });

  it("질문을 펼치면 답변과 링크가 보이고 라우터가 해시를 갱신한다", () => {
    render(<SupportFaqAccordion />);
    const toggles = screen.getAllByRole("link", { name: "FAQ 질문 접기/펼치기" });
    fireEvent.click(toggles[1]);

    expect(screen.getByText("게시글 목록 바로가기")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "게시글 목록 바로가기" })).toHaveAttribute(
      "href",
      "/list"
    );
    expect(mockRouterReplace).toHaveBeenCalledWith("/support#faq-2", { scroll: false });
  });

  it("펼친 항목을 다시 누르면 접힌다", () => {
    render(<SupportFaqAccordion />);
    const toggles = screen.getAllByRole("link", { name: "FAQ 질문 접기/펼치기" });
    fireEvent.click(toggles[0]);
    expect(screen.getByTestId("faq-chip")).toHaveTextContent("전체");
    fireEvent.click(toggles[0]);
    expect(screen.queryByTestId("faq-chip")).not.toBeInTheDocument();
  });
});
