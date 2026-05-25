import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatItem from "./ChatItem";
import { ChatRoom } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { MOCK_CHAT_ITEM } from "@/mock/data/chat.data";

jest.mock("next/image", () => (props: any) => {
  return <img {...props} />;
});

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/common", () => ({
  __esModule: true,
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
  ProfileAvatar: (props: { alt?: string; src?: string | null }) => (
    <img
      alt={props.alt ?? "유저 프로필 이미지"}
      data-testid="profile-avatar"
      src={props.src ?? undefined}
    />
  ),
  ListItemImage: (props: { alt?: string; src?: string | null; category?: string }) => (
    <img
      alt={props.alt ?? "게시글 썸네일"}
      data-testid="list-item-image"
      src={props.src ?? undefined}
    />
  ),
}));

const createMockChatRoom = (overrides?: Partial<ChatRoom>): ChatRoom => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  return {
    ...MOCK_CHAT_ITEM,
    contactUser: { ...MOCK_CHAT_ITEM.contactUser, profileImageUrl: null },
    lastMessageSentAt: tenMinutesAgo,
    ...overrides,
  };
};

describe("ChatItem", () => {
  const mockChatRoom = createMockChatRoom();

  it("채팅방 링크에 화면 텍스트와 일치하는 접근성 라벨이 설정됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "aria-label",
      "사용자 닉네임, 서울시 강남구 신사동, 10분 전, 안녕하세요! 혹시 올리신 검정색 카드 지갑, 명동에서 발견하신 지갑이실까요? 혹시나 해서, 읽지 않은 메시지 1개"
    );
  });

  it("링크가 올바른 href를 가지고 렌더링됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/chat/1?roomId=1");
  });

  it("유저 프로필 이미지와 게시글 썸네일 이미지가 렌더링됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    const profileImage = screen.getByAltText("유저 프로필 이미지");
    const thumbnailImage = screen.getByAltText("채팅리스트 게시글 썸네일");

    expect(profileImage).toBeInTheDocument();
    expect(thumbnailImage).toBeInTheDocument();
  });

  it("프로필 이미지가 있을 때 Image가 렌더링됩니다", () => {
    const chatRoomWithProfile = createMockChatRoom({
      contactUser: {
        userId: 1,
        nickname: "사용자 닉네임",
        profileImageUrl: "profile.jpg",
        withdrawn: false,
      },
    });

    render(<ChatItem chatRoom={chatRoomWithProfile} />);

    const profileImage = screen.getByAltText("유저 프로필 이미지");
    expect(profileImage).toBeInTheDocument();
  });

  it("사용자 닉네임이 렌더링됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    expect(screen.getByText("사용자 닉네임")).toBeInTheDocument();
  });

  it("위치와 시간 정보가 렌더링됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    expect(screen.getByText(/서울시 강남구 신사동/)).toBeInTheDocument();
    expect(screen.getByText(/10분 전/)).toBeInTheDocument();
  });

  it("메시지 미리보기가 렌더링됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    expect(
      screen.getByText(
        "안녕하세요! 혹시 올리신 검정색 카드 지갑, 명동에서 발견하신 지갑이실까요? 혹시나 해서"
      )
    ).toBeInTheDocument();
  });

  it("알림 배지에 읽지 않은 메시지 개수가 표시됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("unreadCount가 0일 때 알림 배지가 표시되지 않습니다", () => {
    const chatRoomNoUnread = createMockChatRoom({ unreadCount: 0 });
    render(<ChatItem chatRoom={chatRoomNoUnread} />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("withdrawn이 true이면 닉네임 대신 탈퇴한 회원을 표시한다", () => {
    const withdrawnRoom = createMockChatRoom({
      contactUser: { ...MOCK_CHAT_ITEM.contactUser, nickname: "이전닉네임", withdrawn: true },
    });
    render(<ChatItem chatRoom={withdrawnRoom} />);

    expect(screen.getByText("탈퇴한 회원")).toBeInTheDocument();
    expect(screen.queryByText("이전닉네임")).not.toBeInTheDocument();
  });

  it("모든 주요 요소가 함께 렌더링됩니다", () => {
    render(<ChatItem chatRoom={mockChatRoom} />);

    // 링크
    expect(screen.getByRole("link")).toBeInTheDocument();

    // 썸네일 이미지
    expect(screen.getByAltText("채팅리스트 게시글 썸네일")).toBeInTheDocument();

    // 텍스트 내용들
    expect(screen.getByText("사용자 닉네임")).toBeInTheDocument();
    expect(screen.getByText(/서울시 강남구 신사동/)).toBeInTheDocument();
    expect(screen.getByText(/10분 전/)).toBeInTheDocument();
    expect(
      screen.getByText(
        "안녕하세요! 혹시 올리신 검정색 카드 지갑, 명동에서 발견하신 지갑이실까요? 혹시나 해서"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
