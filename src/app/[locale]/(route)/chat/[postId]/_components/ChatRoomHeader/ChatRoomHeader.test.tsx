import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatRoomHeader from "./ChatRoomHeader";
import { ChatRoomResponse } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { PostType } from "@/types";
import { MOCK_CHAT_ROOM_FOUND, MOCK_CHAT_ROOM_LOST } from "@/mock/data/chat.data";

jest.mock("next/image", () => (props: any) => {
  return <img {...props} />;
});

jest.mock("@/components/common", () => ({
  Icon: ({ name, ...rest }: any) => <span data-testid={`icon-${name}`} {...rest} />,
  ListItemImage: (props: { alt?: string; src?: string | null; category?: string }) => (
    <img
      alt={props.alt ?? "게시글 썸네일"}
      data-testid="list-item-image"
      src={props.src ?? undefined}
    />
  ),
}));

jest.mock("../ChatChip/ChatChip", () => ({
  __esModule: true,
  default: ({ postMode }: { postMode: PostType }) => <div data-testid="chat-chip">{postMode}</div>,
}));

jest.mock("../ChatRoomHeaderInfoButton/ChatRoomHeaderInfoButton", () => ({
  __esModule: true,
  default: () => <div data-testid="chat-room-header-info-button">InfoButton</div>,
}));

const renderChatRoomHeader = (
  overrides: Partial<React.ComponentProps<typeof ChatRoomHeader>> = {}
) =>
  render(
    <ChatRoomHeader
      chatRoom={MOCK_CHAT_ROOM_FOUND}
      roomId={MOCK_CHAT_ROOM_FOUND.roomId}
      withdrawn={false}
      {...overrides}
    />
  );

describe("ChatRoomHeader", () => {
  it("chatRoom이 undefined일 때 null을 반환합니다", () => {
    const { container } = renderChatRoomHeader({
      chatRoom: undefined,
      roomId: 0,
      withdrawn: false,
    });
    expect(container.firstChild).toBeNull();
  });

  it("뒤로가기 링크가 렌더링되고 /chat 경로를 가집니다", () => {
    renderChatRoomHeader();

    const backLink = screen.getByRole("link", { name: "뒤로 가기 버튼" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/chat");
    expect(screen.getByTestId("icon-ArrowLeftSmall")).toBeInTheDocument();
  });

  it("사용자 닉네임이 렌더링됩니다", () => {
    renderChatRoomHeader();

    expect(screen.getByText("사용자 닉네임")).toBeInTheDocument();
  });

  it("게시글 썸네일 이미지가 렌더링됩니다", () => {
    renderChatRoomHeader();

    const image = screen.getByAltText("채팅방 게시글 썸네일");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", MOCK_CHAT_ROOM_FOUND.postInfo.thumbnailUrl);
  });

  it("ChatChip이 postType과 함께 렌더링됩니다", () => {
    renderChatRoomHeader();

    const chatChip = screen.getByTestId("chat-chip");
    expect(chatChip).toBeInTheDocument();
    expect(chatChip).toHaveTextContent("FOUND");
  });

  it("postType이 LOST일 때 ChatChip에 LOST가 전달됩니다", () => {
    renderChatRoomHeader({ chatRoom: MOCK_CHAT_ROOM_LOST, roomId: MOCK_CHAT_ROOM_LOST.roomId });

    const chatChip = screen.getByTestId("chat-chip");
    expect(chatChip).toHaveTextContent("LOST");
  });

  it("게시글명이 렌더링됩니다", () => {
    renderChatRoomHeader();

    expect(
      screen.getByText("여기에 게시글명이 표기됩니다 여기에 게시글명이 표기됩니다. 여기에")
    ).toBeInTheDocument();
  });

  it("위치 정보가 렌더링됩니다", () => {
    renderChatRoomHeader();

    expect(screen.getByText("서울시 중구 회현동")).toBeInTheDocument();
  });

  it("ChatRoomHeaderInfoButton이 렌더링됩니다", () => {
    renderChatRoomHeader();

    expect(screen.getByTestId("chat-room-header-info-button")).toBeInTheDocument();
  });

  it("게시글 링크가 올바른 href를 가집니다", () => {
    renderChatRoomHeader();

    const link = screen.getByRole("link", { name: "게시글 상세 페이지 이동" });
    expect(link).toHaveAttribute("href", `/list/${MOCK_CHAT_ROOM_FOUND.postInfo.postId}`);
  });

  it("썸네일이 없을 때 category를 사용하여 렌더링됩니다", () => {
    const chatRoomWithoutThumbnail: ChatRoomResponse = {
      ...MOCK_CHAT_ROOM_FOUND,
      postInfo: {
        ...MOCK_CHAT_ROOM_FOUND.postInfo,
        thumbnailUrl: null,
        category: "WALLET",
      },
    };

    renderChatRoomHeader({
      chatRoom: chatRoomWithoutThumbnail,
      roomId: chatRoomWithoutThumbnail.roomId,
    });

    const image = screen.getByAltText("채팅방 게시글 썸네일");
    expect(image).toBeInTheDocument();
  });

  it("모든 주요 요소가 함께 렌더링됩니다", () => {
    renderChatRoomHeader();

    // 뒤로가기 링크
    expect(screen.getByRole("link", { name: "뒤로 가기 버튼" })).toBeInTheDocument();
    expect(screen.getByTestId("icon-ArrowLeftSmall")).toBeInTheDocument();

    // 사용자 닉네임
    expect(screen.getByText("사용자 닉네임")).toBeInTheDocument();

    // 정보 버튼
    expect(screen.getByTestId("chat-room-header-info-button")).toBeInTheDocument();

    // 게시글 썸네일
    expect(screen.getByAltText("채팅방 게시글 썸네일")).toBeInTheDocument();

    // ChatChip
    expect(screen.getByTestId("chat-chip")).toBeInTheDocument();

    // 게시글명
    expect(
      screen.getByText("여기에 게시글명이 표기됩니다 여기에 게시글명이 표기됩니다. 여기에")
    ).toBeInTheDocument();

    // 위치 정보
    expect(screen.getByText("서울시 중구 회현동")).toBeInTheDocument();
  });

  it("withdrawn이 true이면 닉네임 대신 탈퇴 문구를 표시한다", () => {
    renderChatRoomHeader({
      withdrawn: true,
      currentUserId: 999,
    });

    expect(screen.getByText("탈퇴한 회원이에요")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "상대방 프로필 이동" })).not.toBeInTheDocument();
  });

  it("withdrawn이 true이고 내 게시글 채팅이면 상대 닉네임 대신 탈퇴 문구를 표시한다", () => {
    renderChatRoomHeader({
      withdrawn: true,
      currentUserId: MOCK_CHAT_ROOM_FOUND.opponentUser.opponentUserId,
    });

    expect(screen.getByText("탈퇴한 회원이에요")).toBeInTheDocument();
  });
});
