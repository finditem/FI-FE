import { render, screen } from "@testing-library/react";
import AdminListItem from "./AdminListItem";
import { MOCK_NOTICE_LIST } from "@/mock/data";

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : href?.pathname} {...rest}>
      {children}
    </a>
  );
});

const formatDateMock = jest.fn((value: string) => "2026.02.16");

jest.mock("@/utils", () => ({
  formatDate: (value: string) => formatDateMock(value),
}));

jest.mock("@/components/common", () => ({
  Badge: ({ variant }: { variant: string }) => <span data-testid={`badge-${variant}`} />,
  Icon: ({ name, size }: { name: string; size: number }) => (
    <span data-testid={`icon-${name}`} data-size={size} />
  ),
  ListItemImage: ({ src, alt, size }: { src: string; alt: string; size: number }) => (
    <img data-testid="list-item-image" src={src} alt={alt} data-size={size} />
  ),
}));

describe("AdminListItem", () => {
  beforeEach(() => {
    formatDateMock.mockClear();
  });

  it("기본 렌더링: 제목/날짜/카운트/이미지/링크", () => {
    render(<AdminListItem data={MOCK_NOTICE_LIST} imageAlt="썸네일" link="/admin/notice/1" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/admin/notice/1");

    expect(
      screen.getByRole("heading", { level: 2, name: "[공지] 공지사항 제목" })
    ).toBeInTheDocument();
    const time = screen.getByText("2026.02.16").closest("time");
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute("dateTime", "2025-12-26 10:22:58");
    expect(formatDateMock).toHaveBeenCalledTimes(1);
    expect(formatDateMock).toHaveBeenCalledWith("2025-12-26 10:22:58");

    expect(screen.getByTestId("icon-Like")).toBeInTheDocument();
    expect(screen.getByTestId("icon-Eye")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();

    const img = screen.getByTestId("list-item-image");
    expect(img).toHaveAttribute("src", "https://picsum.photos/400/300?random=1");
    expect(img).toHaveAttribute("alt", "썸네일");
    expect(img).toHaveAttribute("data-size", "90");
  });

  it("isNew/isHot일 때 배지 렌더", () => {
    render(
      <AdminListItem
        data={{ ...MOCK_NOTICE_LIST, isNew: true, isHot: true }}
        imageAlt="썸네일"
        link="/admin/notice/1"
      />
    );

    expect(screen.getByTestId("badge-new")).toBeInTheDocument();
    expect(screen.getByTestId("badge-hot")).toBeInTheDocument();
  });

  it("isNew만 true일 때 new 배지만 렌더", () => {
    render(
      <AdminListItem
        data={{ ...MOCK_NOTICE_LIST, isNew: true, isHot: false }}
        imageAlt="썸네일"
        link="/admin/notice/1"
      />
    );

    expect(screen.getByTestId("badge-new")).toBeInTheDocument();
    expect(screen.queryByTestId("badge-hot")).not.toBeInTheDocument();
  });

  it("isHot만 true일 때 hot 배지만 렌더", () => {
    render(
      <AdminListItem
        data={{ ...MOCK_NOTICE_LIST, isNew: false, isHot: true }}
        imageAlt="썸네일"
        link="/admin/notice/1"
      />
    );

    expect(screen.queryByTestId("badge-new")).not.toBeInTheDocument();
    expect(screen.getByTestId("badge-hot")).toBeInTheDocument();
  });
});
