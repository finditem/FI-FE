import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostListItem from "./PostListItem";
import { MOCK_POST_ITEM } from "@/mock/data";

jest.mock("next/image", () => (props: any) => {
  return <img {...props} />;
});

jest.mock("@/components/common", () => ({
  Icon: ({ name, ...rest }: any) => <span data-testid={`icon-${name}`} {...rest} />,
  Badge: ({ variant }: { variant: string }) => <span data-testid={`badge-${variant}`}>badge</span>,
  Chip: ({ label, type }: { label: string; type: string }) => (
    <span data-testid={`chip-${type}`}>{label}</span>
  ),
  ListItemImage: ({ src, alt, size }: any) => (
    <img src={src} alt={alt} width={size} height={size} />
  ),
}));

describe("PostListItem", () => {
  it("list: 타이틀/설명/배지/칩/아이콘/이미지와 올바른 링크를 렌더링합니다", () => {
    render(<PostListItem post={MOCK_POST_ITEM} linkState="list" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/list/${MOCK_POST_ITEM.id}`);

    expect(screen.getByText(MOCK_POST_ITEM.title)).toBeInTheDocument();
    expect(screen.getByText(MOCK_POST_ITEM.summary)).toBeInTheDocument();

    expect(screen.getByText("찾아요")).toBeInTheDocument();
    expect(screen.getByText("전자기기")).toBeInTheDocument();

    const starIcon = screen.getByTestId("icon-Star");
    expect(starIcon.parentElement).toHaveTextContent(String(MOCK_POST_ITEM.favoriteCount));

    const eyeIcon = screen.getByTestId("icon-Eye");
    expect(eyeIcon.parentElement).toHaveTextContent(String(MOCK_POST_ITEM.viewCount));

    const img = screen.getByAltText("게시글 대표 이미지") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src") || "").toContain("https://picsum.photos/400/300?random=1");
  });
});
