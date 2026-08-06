import { render, screen, fireEvent } from "@testing-library/react";
import InquiryCommentItem from "./InquiryCommentItem";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) => (
    <img src={src} alt={alt} onClick={onClick} />
  ),
}));

jest.mock("@/components/common", () => ({
  Chip: ({ label }: { label: string }) => <span>{label}</span>,
  ProfileAvatar: () => <div />,
}));

jest.mock("@/components/domain", () => ({
  ImageViewerModal: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div>이미지 뷰어</div> : null),
}));

const baseData = {
  content: "문의 내용입니다.",
  authorName: "홍길동",
  createdAt: "2024-01-15T14:30:00",
  profileImg: "",
  imageList: [],
  admin: false,
};

describe("InquiryCommentItem", () => {
  it("작성자 이름과 내용이 렌더된다", () => {
    render(<InquiryCommentItem data={baseData as any} />);
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("문의 내용입니다.")).toBeInTheDocument();
  });

  it("admin=true이면 '관리자' 칩이 표시된다", () => {
    render(<InquiryCommentItem data={{ ...baseData, admin: true } as any} />);
    expect(screen.getByText("관리자")).toBeInTheDocument();
  });

  it("admin=false이면 '관리자' 칩이 표시되지 않는다", () => {
    render(<InquiryCommentItem data={baseData as any} />);
    expect(screen.queryByText("관리자")).not.toBeInTheDocument();
  });

  it("imageList에 이미지가 있으면 렌더된다", () => {
    render(
      <InquiryCommentItem
        data={
          {
            ...baseData,
            imageList: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
          } as any
        }
      />
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("이미지 클릭 시 이미지 뷰어 모달이 열린다", () => {
    render(
      <InquiryCommentItem
        data={{ ...baseData, imageList: ["https://example.com/img1.jpg"] } as any}
      />
    );
    expect(screen.queryByText("이미지 뷰어")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("img", { name: "첨부 이미지 1" }));
    expect(screen.getByText("이미지 뷰어")).toBeInTheDocument();
  });
});
