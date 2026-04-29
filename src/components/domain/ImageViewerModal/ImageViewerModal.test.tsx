import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageViewerModal from "./ImageViewerModal";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, priority, ...rest }: any) => <img src={src} alt={alt} {...rest} />,
}));

describe("ImageViewerModal", () => {
  const images = ["/img-a.jpg", "/img-b.jpg"];

  it("isOpen이 false이면 다이얼로그를 렌더하지 않습니다", () => {
    render(
      <ImageViewerModal images={images} initialIndex={0} isOpen={false} onClose={jest.fn()} />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("isOpen이 true이면 다이얼로그가 문서에 나타납니다", () => {
    render(<ImageViewerModal images={images} initialIndex={0} isOpen onClose={jest.fn()} />);
    expect(screen.getByRole("dialog", { name: "이미지 상세 보기 모달" })).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose가 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ImageViewerModal images={images} initialIndex={0} isOpen onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "이미지 상세 보기 닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("imageInfo가 있으면 업로더명이 헤더에 보입니다", () => {
    render(
      <ImageViewerModal
        images={images}
        initialIndex={0}
        isOpen
        onClose={jest.fn()}
        imageInfo={{ uploader: "작성자A", createdAt: "2026-04-01T10:00:00.000Z" }}
      />
    );
    expect(screen.getByText("작성자A")).toBeInTheDocument();
  });

  it("이미지가 2장 이상이면 이전·다음 버튼이 보입니다", () => {
    render(<ImageViewerModal images={images} initialIndex={0} isOpen onClose={jest.fn()} />);
    expect(screen.getByRole("button", { name: "이전 이미지 버튼" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 이미지 버튼" })).toBeInTheDocument();
  });
});
