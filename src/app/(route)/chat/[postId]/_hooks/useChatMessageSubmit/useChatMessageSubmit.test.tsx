import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sendChatSocketMessage } from "@/api/fetch/chatRoom";
import { addMessageToCache, removeMessageFromCache } from "../../_utils";
import useChatMessageSubmit from "./useChatMessageSubmit";

jest.mock("@/api/fetch/chatRoom", () => ({
  sendChatSocketMessage: jest.fn(),
}));

jest.mock("../../_utils", () => ({
  addMessageToCache: jest.fn(),
  removeMessageFromCache: jest.fn(),
}));

const mockSendChatSocketMessage = jest.mocked(sendChatSocketMessage);
const mockAddMessageToCache = jest.mocked(addMessageToCache);
const mockRemoveMessageFromCache = jest.mocked(removeMessageFromCache);

describe("useChatMessageSubmit", () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    jest.spyOn(Date, "now").mockReturnValue(9_000_000_000);
    mockSendChatSocketMessage.mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("내용이 비었거나 공백만이면 전송·캐시 갱신·reset을 하지 않는다", () => {
    const reset = jest.fn();
    const { result } = renderHook(
      () =>
        useChatMessageSubmit({
          roomId: 1,
          userId: 10,
          reset,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.onSubmit({ content: "" });
      result.current.onSubmit({ content: "   " });
    });

    expect(mockAddMessageToCache).not.toHaveBeenCalled();
    expect(mockSendChatSocketMessage).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  it("roomId가 없으면 아무 것도 하지 않는다", () => {
    const reset = jest.fn();
    const { result } = renderHook(
      () =>
        useChatMessageSubmit({
          roomId: 0,
          userId: 10,
          reset,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.onSubmit({ content: "hello" });
    });

    expect(mockAddMessageToCache).not.toHaveBeenCalled();
    expect(mockSendChatSocketMessage).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  it("userId가 0이면 아무 것도 하지 않는다", () => {
    const reset = jest.fn();
    const { result } = renderHook(
      () =>
        useChatMessageSubmit({
          roomId: 1,
          userId: 0,
          reset,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.onSubmit({ content: "hello" });
    });

    expect(mockAddMessageToCache).not.toHaveBeenCalled();
    expect(mockSendChatSocketMessage).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  it("전송 성공 시 낙관적 메시지를 캐시에 넣고 소켓 전송 후 reset·onSendSuccess를 호출한다", () => {
    mockSendChatSocketMessage.mockReturnValue(true);
    const reset = jest.fn();
    const onSendSuccess = jest.fn();

    const { result } = renderHook(
      () =>
        useChatMessageSubmit({
          roomId: 7,
          userId: 99,
          reset,
          onSendSuccess,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.onSubmit({ content: "안녕" });
    });

    expect(mockAddMessageToCache).toHaveBeenCalledTimes(1);
    expect(mockAddMessageToCache.mock.calls[0][1]).toBe(7);
    expect(mockAddMessageToCache.mock.calls[0][2]).toMatchObject({
      messageType: "TEXT",
      senderId: 99,
      content: "안녕",
      imageUrls: [],
      messageId: -9_000_000_000,
    });

    expect(mockSendChatSocketMessage).toHaveBeenCalledWith(`/app/chats/7/send`, {
      content: "안녕",
    });

    expect(mockRemoveMessageFromCache).not.toHaveBeenCalled();
    expect(reset).toHaveBeenCalledTimes(1);
    expect(onSendSuccess).toHaveBeenCalledTimes(1);
  });

  it("전송 실패 시 낙관적 메시지를 캐시에서 제거하고 reset은 호출한다", () => {
    mockSendChatSocketMessage.mockReturnValue(false);
    const reset = jest.fn();
    const onSendSuccess = jest.fn();

    const { result } = renderHook(
      () =>
        useChatMessageSubmit({
          roomId: 3,
          userId: 5,
          reset,
          onSendSuccess,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.onSubmit({ content: "실패 케이스" });
    });

    expect(mockRemoveMessageFromCache).toHaveBeenCalledTimes(1);
    expect(mockRemoveMessageFromCache).toHaveBeenCalledWith(
      expect.any(QueryClient),
      3,
      -9_000_000_000
    );
    expect(reset).toHaveBeenCalledTimes(1);
    expect(onSendSuccess).not.toHaveBeenCalled();
  });
});
