import { render, screen } from "@testing-library/react";
import SimilarItemsList from "./SimilarItemsList";
import { MOCK_SIMILAR_POST_ITEMS } from "@/mock/data";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt} />;
  },
}));

describe("비슷한 게시글 리스트 아이템", () => {
  it("썸네일 이미지가 있을 때 이미지가 렌더링되어야 한다.", () => {
    render(<SimilarItemsList data={[MOCK_SIMILAR_POST_ITEMS]} />);

    const image = screen.getByAltText(MOCK_SIMILAR_POST_ITEMS.title);
    expect(image).toBeInTheDocument();
  });

  it("제목이 렌더링되어야 한다.", () => {
    render(<SimilarItemsList data={[MOCK_SIMILAR_POST_ITEMS]} />);

    const titleElement = screen.getByText(MOCK_SIMILAR_POST_ITEMS.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("날짜가 렌더링되어야 한다.", () => {
    render(<SimilarItemsList data={[MOCK_SIMILAR_POST_ITEMS]} />);

    const dateElement = screen.getByText(/2026.02.15/);
    expect(dateElement).toBeInTheDocument();
  });

  it("이미지가 없을 경우 대체 아이콘이 렌더링되어야 한다.", () => {
    const noImageData = { ...MOCK_SIMILAR_POST_ITEMS, thumbnailImageUrl: "" };
    render(<SimilarItemsList data={[noImageData]} />);

    const iconElement = screen.getByTestId("icon-LogoCharacter");
    expect(iconElement).toBeInTheDocument();
  });
});
