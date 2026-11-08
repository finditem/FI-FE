import { render, screen } from "@testing-library/react";
import SimilarItemsSection from "./SimilarItemsSection";
import { useGetSimilar } from "@/api/fetch/post";
import { MOCK_SIMILAR_POST_ITEMS } from "@/mock/data";

jest.mock("@/api/fetch/post", () => ({
  useGetSimilar: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

const mockUseGetSimilar = useGetSimilar as jest.MockedFunction<typeof useGetSimilar>;

describe("SimilarItemsSection", () => {
  it("비슷한 게시글 데이터가 없을 때 렌더링되지 않아야 한다.", () => {
    mockUseGetSimilar.mockReturnValue({ data: undefined } as any);

    const { container } = render(<SimilarItemsSection postId={1} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("비슷한 게시글 목록이 비어있을 때 렌더링되지 않아야 한다.", () => {
    mockUseGetSimilar.mockReturnValue({ data: { result: [] } } as any);

    const { container } = render(<SimilarItemsSection postId={1} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("비슷한 게시글이 있을 때 기본 제목 '비슷한 분실물'이 렌더링되어야 한다.", () => {
    mockUseGetSimilar.mockReturnValue({ data: { result: [MOCK_SIMILAR_POST_ITEMS] } } as any);

    render(<SimilarItemsSection postId={1} />);

    expect(screen.getByRole("heading", { name: "비슷한 분실물" })).toBeInTheDocument();
  });

  it("title prop이 전달되면 해당 제목이 렌더링되어야 한다.", () => {
    mockUseGetSimilar.mockReturnValue({ data: { result: [MOCK_SIMILAR_POST_ITEMS] } } as any);

    render(<SimilarItemsSection postId={1} title="관련 분실물" />);

    expect(screen.getByRole("heading", { name: "관련 분실물" })).toBeInTheDocument();
  });

  it("비슷한 게시글이 있을 때 구분선이 렌더링되어야 한다.", () => {
    mockUseGetSimilar.mockReturnValue({ data: { result: [MOCK_SIMILAR_POST_ITEMS] } } as any);

    const { container } = render(<SimilarItemsSection postId={1} />);

    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("비슷한 게시글 아이템의 제목이 렌더링되어야 한다.", () => {
    mockUseGetSimilar.mockReturnValue({ data: { result: [MOCK_SIMILAR_POST_ITEMS] } } as any);

    render(<SimilarItemsSection postId={1} />);

    expect(screen.getByText(MOCK_SIMILAR_POST_ITEMS.title)).toBeInTheDocument();
  });
});
