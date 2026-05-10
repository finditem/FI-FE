import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatRoomMain from "./ChatRoomMain";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import {
  MOCK_CHAT_MESSAGES,
  MOCK_CHAT_MESSAGES_FOUR,
  MOCK_CHAT_MESSAGES_THREE_NEXT_SENDER_CHAIN,
  MOCK_CHAT_MESSAGE_IMAGE_PAIR,
  MOCK_CHAT_MESSAGE_UI_TEXT,
} from "@/mock/data/chat.data";

jest.mock("./_internal/hooks", () => ({
  useChatInfiniteScroll: jest.fn(),
  useChatInitialScroll: jest.fn(() => true),
  useChatScrollPreserve: jest.fn(),
  useChatScrollOnSignal: jest.fn(),
}));

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: jest.fn(() => ({
    data: { result: { userId: 1 } },
  })),
}));

jest.mock("./_internal", () => ({
  ChatBox: ({ chat, nextSender, lastChat }: any) => (
    <div
      data-testid="chat-box"
      data-sender-id={chat.senderId}
      data-next-sender={nextSender ?? "undefined"}
      data-last-chat={lastChat}
    >
      {chat.content && <div data-testid="chat-text">{chat.content}</div>}
      <div data-testid="chat-time">{chat.createdAt}</div>
      {chat.imageUrls && chat.imageUrls.length > 0 && (
        <div data-testid="chat-images">{chat.imageUrls.length} images</div>
      )}
    </div>
  ),
  ChatDateDivider: ({ createdAt }: { createdAt: string }) => (
    <div data-testid="chat-date-divider">{createdAt}</div>
  ),
}));

const noop = () => {};

const renderWithMessages = (
  chatMessages: ChatMessage[] = [],
  hasNextPage: boolean | undefined = false,
  isFetchingNextPage: boolean = false
) => {
  return render(
    <ChatRoomMain
      chatMessages={chatMessages}
      fetchNextPage={noop}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      scrollToBottomSignal={0}
    />
  );
};

describe("ChatRoomMain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("채팅 메인 영역이 렌더링됩니다", () => {
    renderWithMessages();
    const scrollContainer = document.querySelector(".overflow-y-scroll");
    expect(scrollContainer).toBeInTheDocument();
  });

  it("빈 chatMessages 배열일 때 ChatBox가 렌더링되지 않습니다", () => {
    renderWithMessages([]);

    expect(screen.queryAllByTestId("chat-box")).toHaveLength(0);
  });

  it("chatMessages가 있을 때 ChatBox들이 렌더링됩니다", () => {
    renderWithMessages(MOCK_CHAT_MESSAGES);

    const chatBoxes = screen.getAllByTestId("chat-box");
    expect(chatBoxes).toHaveLength(2);
  });

  it("ChatBox에 올바른 props가 전달됩니다", () => {
    renderWithMessages(MOCK_CHAT_MESSAGES);

    const chatBoxes = screen.getAllByTestId("chat-box");

    // 첫 번째 ChatBox (i=0, nextSender는 undefined)
    expect(chatBoxes[0]).toHaveAttribute("data-sender-id", "1");
    expect(chatBoxes[0]).toHaveAttribute("data-last-chat", "false");
    expect(chatBoxes[0]).toHaveAttribute("data-next-sender", "undefined");

    // 두 번째 ChatBox (i=1, 마지막 채팅, nextSender는 첫 번째 채팅의 sender)
    expect(chatBoxes[1]).toHaveAttribute("data-sender-id", "2");
    expect(chatBoxes[1]).toHaveAttribute("data-last-chat", "true");
    expect(chatBoxes[1]).toHaveAttribute("data-next-sender", "me");
  });

  it("ChatBox에 채팅 텍스트가 올바르게 전달됩니다", () => {
    renderWithMessages([MOCK_CHAT_MESSAGE_UI_TEXT]);

    expect(screen.getByText("테스트 메시지")).toBeInTheDocument();
  });

  it("이미지가 있는 채팅도 올바르게 렌더링됩니다", () => {
    renderWithMessages([MOCK_CHAT_MESSAGE_IMAGE_PAIR]);

    expect(screen.getByText("2 images")).toBeInTheDocument();
  });

  it("여러 채팅이 있을 때 모든 ChatBox가 렌더링됩니다", () => {
    renderWithMessages(MOCK_CHAT_MESSAGES_FOUR);

    const chatBoxes = screen.getAllByTestId("chat-box");
    expect(chatBoxes).toHaveLength(4);
  });

  it("연속된 같은 발신자의 채팅에서 nextSender가 올바르게 전달됩니다", () => {
    renderWithMessages(MOCK_CHAT_MESSAGES_THREE_NEXT_SENDER_CHAIN);

    const chatBoxes = screen.getAllByTestId("chat-box");

    // 첫 번째 (i=0, 마지막 채팅, nextSender는 undefined)
    expect(chatBoxes[0]).toHaveAttribute("data-next-sender", "undefined");

    // 두 번째 (i=1, nextSender는 첫 번째 채팅의 sender)
    expect(chatBoxes[1]).toHaveAttribute("data-next-sender", "me");

    // 세 번째 (i=2, nextSender는 두 번째 채팅의 sender)
    expect(chatBoxes[2]).toHaveAttribute("data-next-sender", "me");
  });

  it("모든 주요 요소가 함께 렌더링됩니다", () => {
    renderWithMessages([MOCK_CHAT_MESSAGE_UI_TEXT]);

    // ChatBox
    expect(screen.getByTestId("chat-box")).toBeInTheDocument();
    expect(screen.getByText("테스트 메시지")).toBeInTheDocument();
  });
});
