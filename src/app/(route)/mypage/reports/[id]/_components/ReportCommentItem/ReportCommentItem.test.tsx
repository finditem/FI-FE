import { render, screen } from "@testing-library/react";
import ReportCommentItem from "./ReportCommentItem";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

jest.mock("@/components/common", () => ({
  Chip: ({ label }: { label: string }) => <span>{label}</span>,
  ProfileAvatar: () => <div />,
}));

const baseData = {
  answered: false,
  adminAnswer: "관리자 답변 내용",
  adminNickname: "관리자닉네임",
  adminProfileImg: "",
  answerImageList: [],
  resolvedAt: null,
  createdAt: "2024-01-15T14:30:00",
};

describe("ReportCommentItem", () => {
  it("관리자 닉네임과 답변 내용이 렌더된다", () => {
    render(<ReportCommentItem data={baseData as any} />);
    expect(screen.getByText("관리자닉네임")).toBeInTheDocument();
    expect(screen.getByText("관리자 답변 내용")).toBeInTheDocument();
  });

  it("answered=true이면 '관리자' 칩이 표시된다", () => {
    render(<ReportCommentItem data={{ ...baseData, answered: true } as any} />);
    expect(screen.getByText("관리자")).toBeInTheDocument();
  });

  it("answered=false이면 '관리자' 칩이 표시되지 않는다", () => {
    render(<ReportCommentItem data={baseData as any} />);
    expect(screen.queryByText("관리자")).not.toBeInTheDocument();
  });

  it("answerImageList에 이미지가 있으면 이미지가 렌더된다", () => {
    render(
      <ReportCommentItem
        data={
          {
            ...baseData,
            answerImageList: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
          } as any
        }
      />
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("resolvedAt이 있으면 time 요소의 dateTime이 resolvedAt으로 설정된다", () => {
    render(<ReportCommentItem data={{ ...baseData, resolvedAt: "2024-02-20T10:00:00" } as any} />);
    expect(screen.getByRole("time")).toHaveAttribute("dateTime", "2024-02-20T10:00:00");
  });

  it("resolvedAt이 없으면 time 요소의 dateTime이 createdAt으로 설정된다", () => {
    render(<ReportCommentItem data={baseData as any} />);
    expect(screen.getByRole("time")).toHaveAttribute("dateTime", "2024-01-15T14:30:00");
  });
});
