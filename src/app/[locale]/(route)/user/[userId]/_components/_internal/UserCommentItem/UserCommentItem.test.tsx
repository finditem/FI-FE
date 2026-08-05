import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentItem from "./UserCommentItem";

const mockData = {
  postId: 1,
  comment: "여기에 댓글 내용이 표기됩니다",
  date: "2025.11.02",
  likes: 12,
};

describe("CommentItem", () => {
  it("댓글 텍스트가 표시되어야 합니다", () => {
    render(<CommentItem data={mockData} />);
    expect(screen.getByText(mockData.comment)).toBeInTheDocument();
  });

  it("날짜가 표시되어야 합니다", () => {
    render(<CommentItem data={mockData} />);
    expect(screen.getByText(mockData.date)).toBeInTheDocument();
  });

  it("좋아요(하트) 카운트가 표시되어야 합니다", () => {
    render(<CommentItem data={mockData} />);
    expect(screen.getByLabelText(`좋아요 ${mockData.likes}개`)).toBeInTheDocument();
  });

  it("한 줄 말줄임 클래스(line-clamp-1)가 적용되어야 합니다", () => {
    render(<CommentItem data={mockData} />);
    const commentEl = screen.getByText(mockData.comment);
    expect(commentEl).toHaveClass("line-clamp-1");
    expect(commentEl).toHaveClass("w-full");
  });
});
