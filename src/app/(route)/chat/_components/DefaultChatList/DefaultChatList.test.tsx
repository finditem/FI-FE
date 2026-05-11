import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DefaultChatList from "./DefaultChatList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockSearchUpdateQuery = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  Filter: ({ children, onClick, ariaLabel, onSelected }: any) => (
    <button
      data-testid={`filter-${ariaLabel}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-selected={onSelected}
    >
      {children}
    </button>
  ),
}));

jest.mock("../ChatItem/ChatItem", () => ({
  __esModule: true,
  default: () => <div data-testid="chat-item">ChatItem</div>,
}));

jest.mock("../FilterDropdown/FilterDropdown", () => ({
  __esModule: true,
  default: ({ ariaLabel, searchUpdateQuery }: any) => (
    <div data-testid={`filter-dropdown-${ariaLabel}`}>
      <button
        data-testid={`filter-${ariaLabel}`}
        onClick={() => {
          if (ariaLabel.includes("최신순")) {
            searchUpdateQuery("sort", "latest");
          } else if (ariaLabel.includes("분실/발견")) {
            searchUpdateQuery("type", "all");
          }
        }}
      >
        {ariaLabel.includes("최신순") ? "최신순" : "분실/발견"}
      </button>
    </div>
  ),
}));

jest.mock("@/api/fetch/chatRoom", () => {
  const { MOCK_CHAT_ITEM } = require("@/mock/data/chat.data");
  const { MOCK_POST_ITEM } = require("@/mock/data/posts.data");
  return {
    useChatList: jest.fn(() => ({
      data: Array.from({ length: 5 }, (_, i) => ({
        ...MOCK_CHAT_ITEM,
        roomId: i + 1,
        contactUser: {
          userId: i + 1,
          nickname: `User${i + 1}`,
          profileImageUrl: null,
          withdrawn: false,
        },
        postInfo: {
          postId: i + 1,
          postType: MOCK_POST_ITEM.postType,
          title: MOCK_POST_ITEM.title,
          address: MOCK_POST_ITEM.address,
          thumbnailUrl: null,
        },
        lastMessage: "Test message",
        lastMessageSentAt: new Date().toISOString(),
        unreadCount: 0,
      })),
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    })),
  };
});

jest.mock("@/api/_base/query/useAppMutation", () => {
  return jest.fn(() => ({
    mutate: jest.fn(),
    isSuccess: true,
  }));
});

import { useSearchParams } from "next/navigation";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("DefaultChatList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("필터 버튼들이 올바르게 렌더링됩니다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    expect(screen.getByTestId("filter-채팅 리스트 지역 선택")).toBeInTheDocument();
    expect(screen.getByTestId("filter-채팅 리스트 최신순")).toBeInTheDocument();
    expect(screen.getByTestId("filter-채팅 리스트 분실/발견")).toBeInTheDocument();
  });

  it("필터 버튼에 올바른 텍스트가 표시됩니다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    expect(screen.getByText("지역 선택")).toBeInTheDocument();
    expect(screen.getByText("최신순")).toBeInTheDocument();
    expect(screen.getByText("분실/발견")).toBeInTheDocument();
  });

  it("지역 선택 버튼 클릭 시 searchUpdateQuery가 올바른 인자로 호출됩니다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    const regionButton = screen.getByTestId("filter-채팅 리스트 지역 선택");
    regionButton.click();

    expect(mockSearchUpdateQuery).toHaveBeenCalledWith("search", "region");
  });

  it("region 파라미터가 있을 때 지역 선택 버튼이 선택된 상태로 표시됩니다", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("region", "서울시 강남구");
    (useSearchParams as jest.Mock).mockReturnValue(searchParams);

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    const regionButton = screen.getByTestId("filter-채팅 리스트 서울시 강남구");
    expect(regionButton).toHaveAttribute("aria-selected", "true");
  });

  it("region 파라미터가 있을 때 지역 선택 버튼에 선택된 지역명이 표시됩니다", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("region", "서울시 강남구");
    (useSearchParams as jest.Mock).mockReturnValue(searchParams);

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    expect(screen.getByText("서울시 강남구")).toBeInTheDocument();
    expect(screen.queryByText("지역 선택")).not.toBeInTheDocument();
  });

  it("region 파라미터가 없을 때 지역 선택 버튼이 선택되지 않은 상태로 표시됩니다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    const regionButton = screen.getByTestId("filter-채팅 리스트 지역 선택");
    expect(regionButton).toHaveAttribute("aria-selected", "false");
  });

  it("ChatItem 컴포넌트가 5개 렌더링됩니다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    const chatItems = screen.getAllByTestId("chat-item");
    expect(chatItems).toHaveLength(5);
  });

  it("모든 주요 요소가 함께 렌더링됩니다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    renderWithQueryClient(<DefaultChatList searchUpdateQuery={mockSearchUpdateQuery} />);

    // Filter 버튼들
    expect(screen.getByTestId("filter-채팅 리스트 지역 선택")).toBeInTheDocument();
    expect(screen.getByTestId("filter-채팅 리스트 최신순")).toBeInTheDocument();
    expect(screen.getByTestId("filter-채팅 리스트 분실/발견")).toBeInTheDocument();

    // ChatItem들
    const chatItems = screen.getAllByTestId("chat-item");
    expect(chatItems).toHaveLength(5);
  });
});
