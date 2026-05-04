import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import useChatRoom from "@/api/fetch/chatRoom/api/useChatRoom";
import useGetChatRoom from "@/api/fetch/chatRoom/api/useGetChatRoom";
import { useGetUsersMe } from "@/api/fetch/user";
import type { ChatRoomResponse } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import useChatRoomData from "./useChatRoomData";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/api/fetch/chatRoom/api/useChatRoom");
jest.mock("@/api/fetch/chatRoom/api/useGetChatRoom");
jest.mock("@/api/fetch/user");

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseChatRoom = useChatRoom as jest.MockedFunction<typeof useChatRoom>;
const mockUseGetChatRoom = useGetChatRoom as jest.MockedFunction<typeof useGetChatRoom>;
const mockUseGetUsersMe = useGetUsersMe as jest.MockedFunction<typeof useGetUsersMe>;

const userMe = { userId: 1, nickName: "테스트" };

const makeChatRoomResult = (overrides: Partial<ChatRoomResponse> = {}): ChatRoomResponse => ({
  roomId: 10,
  unreadCount: 2,
  opponentUser: {
    opponentUserId: 2,
    nickname: "상대",
    profileImageUrl: "",
    emailVerified: true,
  },
  postInfo: {
    postId: 99,
    postType: "LOST",
    category: "ETC",
    title: "제목",
    address: "주소",
    thumbnailUrl: null,
    deleted: false,
    postStatus: "SEARCHING",
  },
  ...overrides,
});

describe("useChatRoomData", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetUsersMe.mockReturnValue({ data: userMe } as unknown as ReturnType<
      typeof useGetUsersMe
    >);
  });

  it("URL에 roomId가 있으면 hasRoomId가 true이고 useChatRoom은 비활성화된다", () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key: string) => (key === "roomId" ? "42" : null)),
    });
    const detail = makeChatRoomResult({ roomId: 42, unreadCount: 7 });
    mockUseChatRoom.mockReturnValue({ data: undefined } as ReturnType<typeof useChatRoom>);
    mockUseGetChatRoom.mockReturnValue({
      data: { result: detail },
    } as ReturnType<typeof useGetChatRoom>);

    const { result } = renderHook(() => useChatRoomData(100), { wrapper });

    expect(mockUseChatRoom).toHaveBeenCalledWith({ postId: 100, enabled: false });
    expect(mockUseGetChatRoom).toHaveBeenCalledWith({ roomId: 42 });
    expect(result.current.hasRoomId).toBe(true);
    expect(result.current.roomId).toBe(42);
    expect(result.current.chatRoomData).toEqual(detail);
    expect(result.current.unreadCount).toBe(7);
    expect(result.current.userInfo).toEqual(userMe);
    expect(result.current.postMode).toBe("lost");
  });

  it("URL에 roomId가 없으면 useChatRoom이 활성화되고 roomId는 응답에서 가져온다", () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn(() => null),
    });
    const fromPost = makeChatRoomResult({
      roomId: 55,
      unreadCount: 3,
      postInfo: {
        postId: 99,
        postType: "FOUND",
        category: "ETC",
        title: "제목",
        address: "주소",
        thumbnailUrl: null,
        deleted: false,
        postStatus: "FOUND",
      },
    });
    mockUseChatRoom.mockReturnValue({
      data: { result: fromPost },
    } as ReturnType<typeof useChatRoom>);
    mockUseGetChatRoom.mockReturnValue({ data: undefined } as ReturnType<typeof useGetChatRoom>);

    const { result } = renderHook(() => useChatRoomData(200), { wrapper });

    expect(mockUseChatRoom).toHaveBeenCalledWith({ postId: 200, enabled: true });
    expect(result.current.hasRoomId).toBe(false);
    expect(result.current.roomId).toBe(55);
    expect(result.current.chatRoomData).toEqual(fromPost);
    expect(result.current.unreadCount).toBe(3);
    expect(result.current.postMode).toBe("find");
  });

  it("chatRoomDetail과 chatRoom이 모두 있으면 chatRoomData는 detail을 우선한다", () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key: string) => (key === "roomId" ? "1" : null)),
    });
    const detail = makeChatRoomResult({ roomId: 1, unreadCount: 9 });
    const fromList = makeChatRoomResult({
      roomId: 1,
      unreadCount: 1,
      postInfo: {
        ...makeChatRoomResult().postInfo,
        postType: "FOUND",
      },
    });
    mockUseChatRoom.mockReturnValue({
      data: { result: fromList },
    } as ReturnType<typeof useChatRoom>);
    mockUseGetChatRoom.mockReturnValue({
      data: { result: detail },
    } as ReturnType<typeof useGetChatRoom>);

    const { result } = renderHook(() => useChatRoomData(1), { wrapper });

    expect(result.current.chatRoomData).toEqual(detail);
    expect(result.current.unreadCount).toBe(9);
    expect(result.current.postMode).toBe("lost");
  });

  it("데이터가 없으면 roomId는 0이고 chatRoomData는 undefined다", () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn(() => null),
    });
    mockUseChatRoom.mockReturnValue({ data: undefined } as ReturnType<typeof useChatRoom>);
    mockUseGetChatRoom.mockReturnValue({ data: undefined } as ReturnType<typeof useGetChatRoom>);

    const { result } = renderHook(() => useChatRoomData(1), { wrapper });

    expect(result.current.roomId).toBe(0);
    expect(result.current.chatRoomData).toBeUndefined();
    expect(result.current.unreadCount).toBeUndefined();
  });
});
