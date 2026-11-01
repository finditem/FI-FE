import { renderHook, act } from "@testing-library/react";
import { useToggleFavorite } from "./useToggleFavorite";

const mockPostFavorite = jest.fn();
const mockDeleteFavorite = jest.fn();
const mockOpenGuestModal = jest.fn();
const mockUseGetUsersMe = jest.fn();

jest.mock("@/api/fetch/post", () => ({
  usePostFavorites: () => ({ mutate: mockPostFavorite, isPending: false }),
  useDeletePostFavorites: () => ({ mutate: mockDeleteFavorite, isPending: false }),
}));

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: () => mockUseGetUsersMe(),
}));

const renderToggleFavorite = () =>
  renderHook(() => useToggleFavorite({ postId: 35, openGuestModal: mockOpenGuestModal }));

describe("useToggleFavorite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("비로그인이면 즐겨찾기 요청을 보내지 않고 로그인 안내 모달을 연다", () => {
    mockUseGetUsersMe.mockReturnValue({ data: undefined });
    const { result } = renderToggleFavorite();

    act(() => result.current.handleToggleFavorite(false));

    expect(mockOpenGuestModal).toHaveBeenCalledTimes(1);
    expect(mockPostFavorite).not.toHaveBeenCalled();
    expect(mockDeleteFavorite).not.toHaveBeenCalled();
  });

  it("로그인 상태에서 즐겨찾기하지 않은 게시글은 즐겨찾기 요청을 보낸다", () => {
    mockUseGetUsersMe.mockReturnValue({ data: { result: { userId: 1 } } });
    const { result } = renderToggleFavorite();

    act(() => result.current.handleToggleFavorite(false));

    expect(mockPostFavorite).toHaveBeenCalledWith({ postId: 35 });
    expect(mockOpenGuestModal).not.toHaveBeenCalled();
  });

  it("로그인 상태에서 이미 즐겨찾기한 게시글은 즐겨찾기 해제 요청을 보낸다", () => {
    mockUseGetUsersMe.mockReturnValue({ data: { result: { userId: 1 } } });
    const { result } = renderToggleFavorite();

    act(() => result.current.handleToggleFavorite(true));

    expect(mockDeleteFavorite).toHaveBeenCalledWith({ postId: 35 });
    expect(mockOpenGuestModal).not.toHaveBeenCalled();
  });
});
