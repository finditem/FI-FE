import { render, screen } from "@testing-library/react";
import AdminReportsItem from "./AdminReportsItem";

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : href?.pathname} {...rest}>
      {children}
    </a>
  );
});

const formatDateMock = jest.fn((value: string) => "2026.02.16");
const cnMock = jest.fn((...args: any[]) => args.filter(Boolean).join(" "));

jest.mock("@/utils", () => ({
  formatDate: (value: string) => formatDateMock(value),
  cn: (...args: any[]) => cnMock(...args),
}));

describe("AdminReportsItem", () => {
  beforeEach(() => {
    formatDateMock.mockClear();
    cnMock.mockClear();
  });

  it("링크/뱃지/텍스트/날짜 렌더", () => {
    const data = {
      href: "/admin/reports/report/1",
      processStatus: { label: "접수", className: "bg-a text-a" },
      answerStatus: { label: "미답변", className: "bg-b text-b" },
      title: "게시글 신고",
      nickname: "짱구",
      createdAt: "2026-02-16T10:00:00",
      content: "스팸입니다",
    } as any;

    const { container } = render(<AdminReportsItem data={data} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/admin/reports/report/1");

    expect(screen.getByRole("heading", { level: 2, name: "게시글 신고" })).toBeInTheDocument();

    const processBadge = screen.getByText("접수");
    expect(processBadge).toBeInTheDocument();
    expect(processBadge).toHaveClass("rounded-full", "px-3", "py-1", "bg-a", "text-a");

    const answerBadge = screen.getByText("미답변");
    expect(answerBadge).toBeInTheDocument();
    expect(answerBadge).toHaveClass("rounded-full", "px-3", "py-1", "bg-b", "text-b");

    expect(screen.getByText("짱구")).toBeInTheDocument();
    expect(screen.getByText("2026.02.16")).toBeInTheDocument();
    expect(formatDateMock).toHaveBeenCalledTimes(1);
    expect(formatDateMock).toHaveBeenCalledWith("2026-02-16T10:00:00");

    expect(screen.getByText("스팸입니다")).toBeInTheDocument();

    expect(cnMock).toHaveBeenCalledWith("rounded-full px-3 py-1", "bg-a text-a");
    expect(cnMock).toHaveBeenCalledWith("rounded-full px-3 py-1", "bg-b text-b");

    expect(container.querySelector("li")).toBeInTheDocument();
  });
});
