import { renderHook, act } from "@testing-library/react";
import { useToggleLike } from "./useToggleLike";

const mockPostLike = jest.fn();
const mockDeleteLike = jest.fn();
const mockOpenGuestModal = jest.fn();

jest.mock("@/api/fetch/notice", () => ({
  usePostNoticeLike: () => ({ mutate: mockPostLike, isPending: false }),
  useDeleteNoticeLike: () => ({ mutate: mockDeleteLike, isPending: false }),
}));

const renderToggleLike = (isLoggedIn: boolean) =>
  renderHook(() => useToggleLike({ noticeId: 3, isLoggedIn, openGuestModal: mockOpenGuestModal }));

describe("useToggleLike", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("비로그인이면 추천 요청을 보내지 않고 로그인 안내 모달을 연다", () => {
    const { result } = renderToggleLike(false);

    act(() => result.current.handleToggleLike(false));

    expect(mockOpenGuestModal).toHaveBeenCalledTimes(1);
    expect(mockPostLike).not.toHaveBeenCalled();
    expect(mockDeleteLike).not.toHaveBeenCalled();
  });

  it("로그인 상태에서 추천하지 않은 공지는 추천 요청을 보낸다", () => {
    const { result } = renderToggleLike(true);

    act(() => result.current.handleToggleLike(false));

    expect(mockPostLike).toHaveBeenCalledTimes(1);
    expect(mockOpenGuestModal).not.toHaveBeenCalled();
  });

  it("로그인 상태에서 이미 추천한 공지는 추천 취소 요청을 보낸다", () => {
    const { result } = renderToggleLike(true);

    act(() => result.current.handleToggleLike(true));

    expect(mockDeleteLike).toHaveBeenCalledTimes(1);
    expect(mockOpenGuestModal).not.toHaveBeenCalled();
  });
});
