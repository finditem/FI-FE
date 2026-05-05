import { render, screen, waitFor } from "@testing-library/react";
import NoticeDetailView from "./NoticeDetailView";
import { useGetNoticeDetail } from "@/api/fetch/notice";
import { useGetNoticeComment, useDeleteNoticeComment } from "@/api/fetch/noticeComment";
import { useGetUsersMe } from "@/api/fetch/user";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useHandleNoticeReplySubmit } from "../../_hooks/useHandleNoticeReplySubmit/useHandleNoticeReplySubmit";
import { useToggleNoticeCommentLike } from "../../_hooks/useToggleNoticeCommentLike/useToggleNoticeCommentLike";

const mockAddToast = jest.fn();
const mockReplace = jest.fn();
const mockFetchNextPage = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockMutateDelete = jest.fn();
const mockHandleReplySubmit = jest.fn();
const mockHandleToggleFavorite = jest.fn();
const CommentListMock = jest.fn(() => <div data-testid="comment-list" />);

jest.mock("@/components/domain", () => ({
  CommentList: (props: Record<string, unknown>) => CommentListMock(props),
}));

jest.mock("./_internal", () => ({
  NoticeCommentForm: () => <div data-testid="notice-comment-form" />,
  NoticeDetailContent: ({ noticeDetail }: { noticeDetail?: { title?: string } }) => (
    <div data-testid="notice-detail-content">{noticeDetail?.title}</div>
  ),
  NoticeDetailSkeleton: () => <div data-testid="notice-detail-skeleton" />,
}));

jest.mock("@/api/fetch/notice", () => ({
  useGetNoticeDetail: jest.fn(),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: jest.fn(),
}));

jest.mock("@/api/fetch/noticeComment", () => ({
  useGetNoticeComment: jest.fn(),
  useDeleteNoticeComment: jest.fn(),
  useGetRepliesNoticeComment: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("../../_hooks/useHandleNoticeReplySubmit/useHandleNoticeReplySubmit", () => ({
  useHandleNoticeReplySubmit: jest.fn(),
}));

jest.mock("../../_hooks/useToggleNoticeCommentLike/useToggleNoticeCommentLike", () => ({
  useToggleNoticeCommentLike: jest.fn(),
}));

const noticeResult = { title: "공지 제목", noticeId: 1 };

describe("NoticeDetailView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    CommentListMock.mockClear();

    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    (useDeleteNoticeComment as jest.Mock).mockReturnValue({
      mutate: mockMutateDelete,
    });

    (useHandleNoticeReplySubmit as jest.Mock).mockReturnValue({
      handleReplySubmit: mockHandleReplySubmit,
      isPending: false,
    });

    (useToggleNoticeCommentLike as jest.Mock).mockReturnValue({
      handleToggleFavorite: mockHandleToggleFavorite,
    });

    (useGetNoticeComment as jest.Mock).mockReturnValue({
      data: {
        comments: [],
        hasNext: false,
        nextPage: 0,
        totalCommentCount: 0,
        remainingCount: 0,
        cursor: 0,
      },
      fetchNextPage: mockFetchNextPage,
    });

    (useGetUsersMe as jest.Mock).mockReturnValue({
      data: { result: { userId: 1, role: "USER" } },
    });
  });

  it("로딩 중이면 스켈레톤을 표시합니다", () => {
    (useGetNoticeDetail as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<NoticeDetailView id={1} />);

    expect(screen.getByTestId("notice-detail-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("notice-detail-content")).not.toBeInTheDocument();
  });

  it("상세 로드 후 본문과 댓글·폼 영역을 렌더합니다", () => {
    (useGetNoticeDetail as jest.Mock).mockReturnValue({
      data: { result: noticeResult },
      isLoading: false,
      isError: false,
    });

    render(<NoticeDetailView id={9} />);

    expect(screen.queryByTestId("notice-detail-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("notice-detail-content")).toHaveTextContent("공지 제목");
    expect(screen.getByTestId("notice-comment-form")).toBeInTheDocument();

    expect(CommentListMock).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: 9,
        isLoggedIn: true,
        isPending: false,
        onSubmit: mockHandleReplySubmit,
        onCommentLoadMore: expect.any(Function),
        onDeleteComment: expect.any(Function),
        onFavoriteComment: expect.any(Function),
      })
    );
  });

  it("비로그인이면 CommentList에 isLoggedIn이 false입니다", () => {
    (useGetNoticeDetail as jest.Mock).mockReturnValue({
      data: { result: noticeResult },
      isLoading: false,
      isError: false,
    });
    (useGetUsersMe as jest.Mock).mockReturnValue({ data: undefined });

    render(<NoticeDetailView id={3} />);

    expect(CommentListMock).toHaveBeenCalledWith(expect.objectContaining({ isLoggedIn: false }));
  });

  it("상세 조회 실패 시 토스트와 목록으로 이동합니다", async () => {
    (useGetNoticeDetail as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<NoticeDetailView id={1} />);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("공지사항 불러오기에 실패했어요", "error");
      expect(mockReplace).toHaveBeenCalledWith("/notice");
    });
  });
});
