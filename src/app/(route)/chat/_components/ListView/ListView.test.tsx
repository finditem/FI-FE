import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListView from "./ListView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const mockSearchUpdateQuery = jest.fn();

jest.mock("@/hooks", () => ({
  useSearchUpdateQueryString: jest.fn(),
}));

jest.mock("@/api/fetch/chatRoom/api/useChatSocket", () => ({
  useChatSocket: jest.fn(),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const ListSearch = require("../ListSearch/ListSearch").default;
    return ListSearch;
  },
}));

jest.mock("../ListSearch/ListSearch", () => ({
  __esModule: true,
  default: () => <div data-testid="list-search"></div>,
}));

jest.mock("@/components/layout", () => ({
  DetailHeader: ({ title }: { title: string }) => <div data-testid="detail-header">{title}</div>,
}));

jest.mock("../DefaultChatList/DefaultChatList", () => ({
  __esModule: true,
  default: ({
    searchUpdateQuery,
  }: {
    searchUpdateQuery: (key: string, value?: string) => void;
  }) => (
    <div data-testid="default-chat-list" onClick={() => searchUpdateQuery("test", "value")}>
      DefaultChatList
    </div>
  ),
}));

import { useSearchUpdateQueryString } from "@/hooks";

const renderWithQueryClient = (component: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe("ListView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("searchMode가 default일 때 채팅 제목과 DefaultList가 렌더링됩니다", () => {
    (useSearchUpdateQueryString as jest.Mock).mockReturnValue({
      searchMode: "default",
      searchUpdateQuery: mockSearchUpdateQuery,
    });

    renderWithQueryClient(<ListView />);

    const detailHeader = screen.getByTestId("detail-header");
    expect(detailHeader).toHaveTextContent("채팅");

    expect(screen.getByTestId("default-chat-list")).toBeInTheDocument();
    expect(screen.queryByTestId("list-search")).not.toBeInTheDocument();
  });

  it("searchMode가 region일 때 지역 선택 제목과 ListSearch가 렌더링됩니다", () => {
    (useSearchUpdateQueryString as jest.Mock).mockReturnValue({
      searchMode: "region",
      searchUpdateQuery: mockSearchUpdateQuery,
    });

    renderWithQueryClient(<ListView />);

    const detailHeader = screen.getByTestId("detail-header");
    expect(detailHeader).toHaveTextContent("지역 선택");

    expect(screen.getByTestId("list-search")).toBeInTheDocument();
    expect(screen.queryByTestId("default-chat-list")).not.toBeInTheDocument();
  });

  it("searchMode가 post일 때 채팅 제목과 ListSearch가 렌더링됩니다", () => {
    (useSearchUpdateQueryString as jest.Mock).mockReturnValue({
      searchMode: "post",
      searchUpdateQuery: mockSearchUpdateQuery,
    });

    renderWithQueryClient(<ListView />);

    const detailHeader = screen.getByTestId("detail-header");
    expect(detailHeader).toHaveTextContent("채팅");

    expect(screen.getByTestId("list-search")).toBeInTheDocument();
    expect(screen.queryByTestId("default-chat-list")).not.toBeInTheDocument();
  });

  it("DefaultChatList에 searchUpdateQuery가 올바르게 전달됩니다", () => {
    (useSearchUpdateQueryString as jest.Mock).mockReturnValue({
      searchMode: "default",
      searchUpdateQuery: mockSearchUpdateQuery,
    });

    renderWithQueryClient(<ListView />);

    const defaultChatList = screen.getByTestId("default-chat-list");
    defaultChatList.click();

    expect(mockSearchUpdateQuery).toHaveBeenCalledWith("test", "value");
  });

  it("ListSearch에 searchMode가 올바르게 전달됩니다", () => {
    (useSearchUpdateQueryString as jest.Mock).mockReturnValue({
      searchMode: "region",
      searchUpdateQuery: mockSearchUpdateQuery,
    });

    renderWithQueryClient(<ListView />);

    const listSearch = screen.getByTestId("list-search");
  });
});
