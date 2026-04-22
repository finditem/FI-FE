import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CommentBody from "./CommentBody";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} data-testid="mock-image" />,
}));

jest.mock("@/components/domain", () => ({
  ImageViewerModal: ({ isOpen }: any) => (isOpen ? <div data-testid="image-viewer-modal" /> : null),
}));

describe("<CommentBody />", () => {
  const defaultProps = {
    bodyData: {
      content: "테스트 내용",
      images: [
        { id: 1, imageUrl: "/img1.jpg", orderIndex: 0 },
        { id: 2, imageUrl: "/img2.jpg", orderIndex: 1 },
      ],
    },
  };

  it("내용과 이미지를 렌더링합니다.", () => {
    render(<CommentBody {...defaultProps} />);
    expect(screen.getByText("테스트 내용")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-image")).toHaveLength(2);
  });

  it("이미지 클릭 시 ImageViewerModal이 열립니다.", async () => {
    render(<CommentBody {...defaultProps} />);
    const images = screen.getAllByTestId("mock-image");

    await userEvent.click(images[0]);
    expect(screen.getByTestId("image-viewer-modal")).toBeInTheDocument();
  });
});
