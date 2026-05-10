import { render, screen, within } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import NoticeList from "./NoticeList";
import type { NoticeItem } from "@/api/fetch/notice";
import { MOCK_NOTICE_ITEM } from "@/mock/data";
import { ReactNode } from "react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const baseNotice = (overrides: Partial<NoticeItem>): NoticeItem => ({
  noticeId: 99,
  title: "테스트 공지 제목",
  category: "GENERAL",
  pinned: false,
  viewCount: 10,
  likeCount: 3,
  thumbnailUrl: null,
  createdAt: "2025-03-01T12:00:00",
  isNew: false,
  isHot: false,
  ...overrides,
});

describe("NoticeList", () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  it("공지가 없으면 EmptyState를 렌더합니다", () => {
    render(<NoticeList notices={[]} />);
    expect(screen.getByText("등록된 공지사항이 없어요")).toBeInTheDocument();
    expect(screen.getByText(/새로운 공지사항이 등록되면/)).toBeInTheDocument();
  });

  it("공지 제목과 상세 링크를 렌더합니다", () => {
    render(<NoticeList notices={[MOCK_NOTICE_ITEM]} />);
    const link = screen.getByRole("link", { name: /서비스 점검 안내/ });
    expect(link).toHaveAttribute("href", `/notice/${MOCK_NOTICE_ITEM.noticeId}`);
  });

  it("isNew·isHot일 때 각각 뱃지 라벨을 표시합니다", () => {
    render(
      <NoticeList
        notices={[baseNotice({ noticeId: 1, isNew: true, isHot: true, title: "배지 테스트" })]}
      />
    );
    const link = screen.getByRole("link", { name: /배지 테스트/ });
    expect(within(link).getByLabelText("최신 글")).toBeInTheDocument();
    expect(within(link).getByLabelText("인기 글")).toBeInTheDocument();
  });

  it("좋아요·조회수를 표시합니다", () => {
    render(<NoticeList notices={[MOCK_NOTICE_ITEM]} />);
    const link = screen.getByRole("link", { name: /서비스 점검 안내/ });
    expect(within(link).getByText(String(MOCK_NOTICE_ITEM.likeCount))).toBeInTheDocument();
    expect(within(link).getByText(String(MOCK_NOTICE_ITEM.viewCount))).toBeInTheDocument();
  });

  it("keyword 쿼리가 있으면 제목에서 검색어를 강조합니다", () => {
    const params = new URLSearchParams();
    params.set("keyword", "서비스");
    (useSearchParams as jest.Mock).mockReturnValue(params);

    render(<NoticeList notices={[MOCK_NOTICE_ITEM]} />);

    const highlight = screen.getByText("서비스");
    expect(highlight.tagName).toBe("SPAN");
    expect(highlight).toHaveClass("text-brand-normal-default");
  });

  it("thumbnailUrl이 있으면 썸네일 이미지를 렌더합니다", () => {
    render(
      <NoticeList
        notices={[
          baseNotice({
            noticeId: 7,
            title: "썸네일 있는 글",
            thumbnailUrl: "https://example.com/thumb.jpg",
          }),
        ]}
      />
    );
    const img = screen.getByRole("img", { name: "공지사항 게시글 썸네일" });
    expect(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
  });

  it("여러 공지를 목록으로 렌더합니다", () => {
    const a = baseNotice({ noticeId: 1, title: "첫 번째" });
    const b = baseNotice({ noticeId: 2, title: "두 번째" });
    render(<NoticeList notices={[a, b]} />);
    expect(screen.getByRole("link", { name: /첫 번째/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /두 번째/ })).toBeInTheDocument();
  });
});
