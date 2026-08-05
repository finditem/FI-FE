import { render, screen } from "@testing-library/react";
import type { NoticeItem } from "@/api/fetch/notice";
import NoticeView from "./NoticeView";
import { useGetNotices } from "@/api/fetch/notice";
import { useInfiniteScroll } from "@/hooks";
import { MOCK_NOTICE_ITEM } from "@/mock/data";

const mockNoticeList = jest.fn(({ notices }: { notices: NoticeItem[] }) => (
  <ul data-testid="notice-list">
    {notices.map((n) => (
      <li key={n.noticeId}>{n.title}</li>
    ))}
  </ul>
));

jest.mock("@/api/fetch/notice", () => ({
  useGetNotices: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  useInfiniteScroll: jest.fn(),
}));

jest.mock("../NoticeList/NoticeList", () => ({
  __esModule: true,
  default: (props: { notices: NoticeItem[] }) => mockNoticeList(props),
}));

jest.mock("./_internal/NoticeListSkeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="notice-list-skeleton" />,
}));

const mockFetchNextPage = jest.fn();

describe("NoticeView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useInfiniteScroll as jest.Mock).mockReturnValue({ ref: jest.fn() });
  });

  it("공지 데이터가 있으면 NoticeList로 목록을 렌더합니다", () => {
    const notices: NoticeItem[] = [MOCK_NOTICE_ITEM];

    (useGetNotices as jest.Mock).mockReturnValue({
      data: notices,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<NoticeView />);

    expect(mockNoticeList).toHaveBeenCalledWith(expect.objectContaining({ notices }));
    expect(screen.getByTestId("notice-list")).toHaveTextContent(MOCK_NOTICE_ITEM.title);
  });

  it("다음 페이지가 있으면 무한 스크롤 센티널 영역을 렌더합니다", () => {
    (useGetNotices as jest.Mock).mockReturnValue({
      data: [],
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    const { container } = render(<NoticeView />);

    expect(useInfiniteScroll).toHaveBeenCalledWith({
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });
    expect(container.querySelector('[class*="h-[100px]"]')).toBeTruthy();
  });

  it("다음 페이지가 없으면 센티널 영역을 렌더하지 않습니다", () => {
    (useGetNotices as jest.Mock).mockReturnValue({
      data: [],
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const { container } = render(<NoticeView />);

    expect(container.querySelector('[class*="h-[100px]"]')).toBeNull();
  });

  it("notices가 비어 있어도 목록 컴포넌트는 빈 배열로 렌더됩니다", () => {
    (useGetNotices as jest.Mock).mockReturnValue({
      data: [],
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<NoticeView />);

    expect(mockNoticeList).toHaveBeenCalledWith(expect.objectContaining({ notices: [] }));
    expect(screen.getByTestId("notice-list")).toBeEmptyDOMElement();
  });
});
