import { renderHook } from "@testing-library/react";
import type { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import { MOCK_CHAT_MESSAGES } from "@/mock/data/chat.data";
import useInitialChatPagination from "./useInitialChatPagination";

describe("useInitialChatPagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chatMessages가 없으면 fetchNextPage를 호출하지 않는다", () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInitialChatPagination({
        chatMessages: undefined,
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    );

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("메시지 배열이 비어 있으면 fetchNextPage를 호출하지 않는다", () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInitialChatPagination({
        chatMessages: [],
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    );

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("hasNextPage가 false면 fetchNextPage를 호출하지 않는다", () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInitialChatPagination({
        chatMessages: [MOCK_CHAT_MESSAGES[0]],
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    );

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("isFetchingNextPage가 true면 fetchNextPage를 호출하지 않는다", () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInitialChatPagination({
        chatMessages: [MOCK_CHAT_MESSAGES[0]],
        hasNextPage: true,
        isFetchingNextPage: true,
        fetchNextPage,
      })
    );

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("조건을 만족하면 최초 한 번만 fetchNextPage를 호출한다", () => {
    const fetchNextPage = jest.fn();

    const { rerender } = renderHook(
      (props: {
        chatMessages: ChatMessage[] | undefined;
        hasNextPage: boolean;
        isFetchingNextPage: boolean;
      }) =>
        useInitialChatPagination({
          ...props,
          fetchNextPage,
        }),
      {
        initialProps: {
          chatMessages: [MOCK_CHAT_MESSAGES[0]],
          hasNextPage: true,
          isFetchingNextPage: false,
        },
      }
    );

    expect(fetchNextPage).toHaveBeenCalledTimes(1);

    rerender({
      chatMessages: [MOCK_CHAT_MESSAGES[0], MOCK_CHAT_MESSAGES[1]],
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("처음에는 다음 페이지를 가져오는 중이었다가 끝나면 한 번 호출한다", () => {
    const fetchNextPage = jest.fn();

    const { rerender } = renderHook(
      (props: { isFetchingNextPage: boolean }) =>
        useInitialChatPagination({
          chatMessages: [MOCK_CHAT_MESSAGES[0]],
          hasNextPage: true,
          isFetchingNextPage: props.isFetchingNextPage,
          fetchNextPage,
        }),
      { initialProps: { isFetchingNextPage: true } }
    );

    expect(fetchNextPage).not.toHaveBeenCalled();

    rerender({ isFetchingNextPage: false });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("메시지가 나중에 채워지면 그때 한 번 호출한다", () => {
    const fetchNextPage = jest.fn();

    const { rerender } = renderHook(
      (props: { chatMessages: ChatMessage[] | undefined }) =>
        useInitialChatPagination({
          chatMessages: props.chatMessages,
          hasNextPage: true,
          isFetchingNextPage: false,
          fetchNextPage,
        }),
      { initialProps: { chatMessages: undefined as ChatMessage[] | undefined } }
    );

    expect(fetchNextPage).not.toHaveBeenCalled();

    rerender({ chatMessages: [MOCK_CHAT_MESSAGES[0]] });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
