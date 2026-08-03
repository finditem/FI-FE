import { act, renderHook } from "@testing-library/react";
import { throttle } from "lodash";
import { useDeleteNoticeCommentLike, usePostNoticeCommentLike } from "@/api/fetch/noticeComment";
import { useToggleNoticeCommentLike } from "./useToggleNoticeCommentLike";

jest.mock("lodash", () => ({
  throttle: jest.fn((fn: (...args: unknown[]) => unknown, _waitMs?: number) =>
    Object.assign((...args: unknown[]) => (fn as (...a: unknown[]) => unknown)(...args), {
      cancel: jest.fn(),
    })
  ),
}));

jest.mock("@/api/fetch/noticeComment", () => ({
  usePostNoticeCommentLike: jest.fn(),
  useDeleteNoticeCommentLike: jest.fn(),
}));

describe("useToggleNoticeCommentLike", () => {
  const mockPostMutate = jest.fn();
  const mockDeleteMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePostNoticeCommentLike as jest.Mock).mockReturnValue({
      mutate: mockPostMutate,
      isPending: false,
    });
    (useDeleteNoticeCommentLike as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });
  });

  it("noticeId로 좋아요 POST·DELETE 훅을 모두 구독합니다", () => {
    renderHook(() => useToggleNoticeCommentLike(77));

    expect(usePostNoticeCommentLike).toHaveBeenCalledWith(77);
    expect(useDeleteNoticeCommentLike).toHaveBeenCalledWith(77);
  });

  it("throttle 간격 300ms로 핸들러를 만듭니다", () => {
    renderHook(() => useToggleNoticeCommentLike(1));

    expect(throttle).toHaveBeenCalledWith(expect.any(Function), 300);
  });

  it("isLike가 true이면 댓글 좋아요 삭제 mutate만 호출합니다", () => {
    const { result } = renderHook(() => useToggleNoticeCommentLike(10));

    const payload = {
      isLike: true,
      commentId: 5,
      queryKey: ["notice-comments", 10] as const,
    };

    act(() => {
      result.current.handleToggleFavorite(payload);
    });

    expect(mockDeleteMutate).toHaveBeenCalledWith({
      commentId: 5,
      queryKey: ["notice-comments", 10],
    });
    expect(mockPostMutate).not.toHaveBeenCalled();
  });

  it("isLike가 false이면 댓글 좋아요 등록 mutate만 호출합니다", () => {
    const { result } = renderHook(() => useToggleNoticeCommentLike(10));

    const payload = {
      isLike: false,
      commentId: 8,
      queryKey: ["replies-notice-comments", 3] as const,
    };

    act(() => {
      result.current.handleToggleFavorite(payload);
    });

    expect(mockPostMutate).toHaveBeenCalledWith({
      commentId: 8,
      queryKey: ["replies-notice-comments", 3],
    });
    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });

  it("POST 또는 DELETE 중 하나라도 pending이면 isPending이 true입니다", () => {
    (usePostNoticeCommentLike as jest.Mock).mockReturnValue({
      mutate: mockPostMutate,
      isPending: true,
    });
    (useDeleteNoticeCommentLike as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });

    const { result: postOnly } = renderHook(() => useToggleNoticeCommentLike(1));
    expect(postOnly.current.isPending).toBe(true);

    (usePostNoticeCommentLike as jest.Mock).mockReturnValue({
      mutate: mockPostMutate,
      isPending: false,
    });
    (useDeleteNoticeCommentLike as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: true,
    });

    const { result: deleteOnly } = renderHook(() => useToggleNoticeCommentLike(1));
    expect(deleteOnly.current.isPending).toBe(true);
  });
});
