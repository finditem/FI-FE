import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CommentMeta from "./CommentMeta";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
  ProfileAvatar: ({ src }: any) => <img data-testid="profile-avatar" src={src} />,
  KebabMenuButton: ({ onClick, disabled }: any) => (
    <button data-testid="kebab-menu" onClick={onClick} disabled={disabled}>
      메뉴
    </button>
  ),
}));

jest.mock("@/components/domain/ReportModal/ReportModal", () => ({
  __esModule: true,
  default: () => <div data-testid="report-modal" />,
}));

jest.mock("@/components/domain/PostReportBlockActions/UserBlockModal/UserBlockModal", () => ({
  __esModule: true,
  default: () => <div data-testid="user-block-modal" />,
}));

describe("<CommentMeta />", () => {
  const defaultProps = {
    data: {
      authorId: "1",
      createdAt: "2024-01-01T00:00:00Z",
      authorName: "테스트유저",
      profileImage: "/img.jpg",
      commentId: 10,
      deleted: false,
      canDelete: true,
    },
    isGuest: false,
    isThreadItem: false,
    queryKey: ["test"],
    onDeleteComment: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("작성자 정보와 프로필 이미지를 렌더링합니다.", () => {
    render(<CommentMeta {...defaultProps} />);
    expect(screen.getByText("테스트유저")).toBeInTheDocument();
    expect(screen.getByTestId("profile-avatar")).toBeInTheDocument();
  });

  it("본인의 댓글이면 삭제 메뉴가 렌더링됩니다.", async () => {
    render(<CommentMeta {...defaultProps} />);
    await userEvent.click(screen.getByTestId("kebab-menu"));
    expect(screen.getByText("댓글 삭제하기")).toBeInTheDocument();
  });

  it("본인의 댓글이 아니면 신고/차단 메뉴가 렌더링됩니다.", async () => {
    render(<CommentMeta {...defaultProps} data={{ ...defaultProps.data, canDelete: false }} />);
    await userEvent.click(screen.getByTestId("kebab-menu"));
    expect(screen.getByText("작성자 신고하기")).toBeInTheDocument();
    expect(screen.getByText("작성자 차단하기")).toBeInTheDocument();
  });

  it("삭제하기 클릭 시 onDeleteComment가 호출됩니다.", async () => {
    render(<CommentMeta {...defaultProps} />);
    await userEvent.click(screen.getByTestId("kebab-menu"));
    await userEvent.click(screen.getByText("댓글 삭제하기"));
    expect(defaultProps.onDeleteComment).toHaveBeenCalled();
  });
});
