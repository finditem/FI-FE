import { render, screen } from "@testing-library/react";
import NoticeList from "./NoticeList";
import { MOCK_NOTICE_LIST } from "@/mock/data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../_components", () => ({
  AdminListItem: ({ link }: { link: string }) => <li data-testid="notice-item" data-link={link} />,
}));

jest.mock("@/api/fetch/notice", () => ({
  useGetNotices: () => ({
    data: Array.from({ length: 10 }).fill(MOCK_NOTICE_LIST),
  }),
}));

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("NoticeList", () => {
  it("섹션 렌더링", () => {
    renderWithQueryClient(<NoticeList />);
    expect(screen.getByRole("region", { name: "공지사항 목록" })).toBeInTheDocument();
  });

  it("공지사항 10개 렌더", () => {
    renderWithQueryClient(<NoticeList />);
    expect(screen.getAllByTestId("notice-item")).toHaveLength(10);
  });

  it("각 아이템 link 값 검증", () => {
    renderWithQueryClient(<NoticeList />);

    const items = screen.getAllByTestId("notice-item");

    items.forEach((item) => {
      expect(item).toHaveAttribute("data-link", `/notice/${MOCK_NOTICE_LIST.noticeId}`);
    });
  });
});
