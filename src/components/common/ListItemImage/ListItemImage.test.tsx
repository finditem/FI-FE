import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListItemImage from "./ListItemImage";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, priority, draggable, sizes, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock("../Icon/Icon", () => ({
  __esModule: true,
  default: ({ name, size, className }: any) => (
    <svg
      data-testid="category-icon"
      data-name={name}
      width={size}
      height={size}
      className={className}
    />
  ),
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("<ListItemImage />", () => {
  it("src와 category가 모두 없으면 렌더링하지 않습니다.", () => {
    const { container } = render(<ListItemImage alt="테스트" size={80} />);
    expect(container.firstChild).toBeNull();
  });

  it("src가 있으면 이미지를 렌더링합니다.", () => {
    render(<ListItemImage src="https://example.com/image.jpg" alt="게시글 이미지" size={80} />);
    expect(screen.getByAltText("게시글 이미지")).toBeInTheDocument();
  });

  it("size prop이 컨테이너의 width/height에 적용됩니다.", () => {
    render(<ListItemImage src="https://example.com/image.jpg" alt="이미지" size={100} />);
    const container = screen.getByAltText("이미지").parentElement!;
    expect(container).toHaveStyle({ width: "100px", height: "100px" });
  });

  it("src가 없고 category가 있으면 카테고리 아이콘을 렌더링합니다.", () => {
    render(<ListItemImage src={null} alt="기본 이미지" size={80} category="ELECTRONICS" />);
    expect(screen.getByTestId("category-icon")).toBeInTheDocument();
  });

  it("category에 해당하는 올바른 아이콘 name이 전달됩니다.", () => {
    render(<ListItemImage src={null} alt="기본 이미지" size={80} category="WALLET" />);
    expect(screen.getByTestId("category-icon")).toHaveAttribute("data-name", "Wallet");
  });

  it("카테고리 아이콘 래퍼에 aria-label이 설정됩니다.", () => {
    render(<ListItemImage src={null} alt="기본 이미지" size={80} category="BAG" />);
    expect(screen.getByLabelText("BAG 기본 이미지")).toBeInTheDocument();
  });

  it("imageCount가 2 이상이면 이미지 수 뱃지를 렌더링합니다.", () => {
    render(
      <ListItemImage src="https://example.com/image.jpg" alt="이미지" size={80} imageCount={3} />
    );
    expect(screen.getByLabelText("이미지 3장")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("imageCount가 1이면 뱃지를 렌더링하지 않습니다.", () => {
    render(
      <ListItemImage src="https://example.com/image.jpg" alt="이미지" size={80} imageCount={1} />
    );
    expect(screen.queryByLabelText("이미지 1장")).not.toBeInTheDocument();
  });

  it("imageCount가 없으면 뱃지를 렌더링하지 않습니다.", () => {
    render(<ListItemImage src="https://example.com/image.jpg" alt="이미지" size={80} />);
    expect(screen.queryByLabelText(/이미지 \d장/)).not.toBeInTheDocument();
  });

  it("className prop이 컨테이너에 적용됩니다.", () => {
    render(
      <ListItemImage
        src="https://example.com/image.jpg"
        alt="이미지"
        size={80}
        className="custom-class"
      />
    );
    const container = screen.getByAltText("이미지").parentElement!;
    expect(container.className).toContain("custom-class");
  });
});
