import {
  ChatRoom,
  ChatRoomResponse,
  WebSocketChatMessage,
} from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";

export const MOCK_CHAT_ITEM = {
  roomId: 1,
  contactUser: {
    userId: 1,
    nickname: "사용자 닉네임",
    profileImageUrl: "profile.jpg",
  },
  postInfo: {
    postId: 1,
    postType: "LOST",
    category: "WALLET",
    title: "테스트 게시글",
    address: "서울시 강남구 신사동",
    thumbnailUrl: "test-thumbnail.jpg",
  },
  messageType: "TEXT",
  lastMessage:
    "안녕하세요! 혹시 올리신 검정색 카드 지갑, 명동에서 발견하신 지갑이실까요? 혹시나 해서",
  lastMessageSentAt: "2026-01-01T10:00:00.000Z",
  unreadCount: 1,
} as ChatRoom;

export const MOCK_CHAT_ROOM_FOUND: ChatRoomResponse = {
  roomId: 1,
  unreadCount: 0,
  opponentUser: {
    opponentUserId: 2,
    nickname: "사용자 닉네임",
    profileImageUrl: "https://via.placeholder.com/40",
    emailVerified: true,
  },
  postInfo: {
    postId: 1,
    postType: "FOUND",
    category: "WALLET",
    title: "여기에 게시글명이 표기됩니다 여기에 게시글명이 표기됩니다. 여기에",
    address: "서울시 중구 회현동",
    thumbnailUrl: "https://via.placeholder.com/40",
    deleted: false,
    postStatus: "FOUND",
  },
};

export const MOCK_CHAT_ROOM_LOST: ChatRoomResponse = {
  roomId: 2,
  unreadCount: 0,
  opponentUser: {
    opponentUserId: 3,
    nickname: "다른 사용자",
    profileImageUrl: "https://via.placeholder.com/40",
    emailVerified: true,
  },
  postInfo: {
    postId: 2,
    postType: "LOST",
    category: "ETC",
    title: "분실물 게시글 제목입니다",
    address: "서울시 강남구 역삼동",
    thumbnailUrl: "https://via.placeholder.com/40",
    deleted: false,
    postStatus: "SEARCHING",
  },
};

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    messageId: 1,
    senderId: 1,
    content: "안녕하세요!",
    messageType: "TEXT",
    createdAt: "2026-01-15T14:11:00.000Z",
    imageUrls: [],
  },
  {
    messageId: 2,
    senderId: 2,
    content: "네, 안녕하세요!",
    messageType: "TEXT",
    createdAt: "2026-01-15T14:12:00.000Z",
    imageUrls: [],
  },
];

/** useChatSocketMessage 등 소켓 훅 테스트용 기본 웹소켓 페이로드 */
export const MOCK_WS_CHAT_MESSAGE: WebSocketChatMessage = {
  messageId: 100,
  roomId: 5,
  senderId: 2,
  content: "안녕",
  messageType: "TEXT",
  createdAt: "2026-01-01T00:00:00.000Z",
};

/** 낙관적 전송 직후 음수 messageId */
export const MOCK_CHAT_MESSAGE_OPTIMISTIC: ChatMessage = {
  messageId: -1,
  messageType: "TEXT",
  senderId: 2,
  content: "안녕",
  imageUrls: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

/** 소켓 새 메시지 도착 전 캐시에만 있는 이전 메시지 한 건 */
export const MOCK_CHAT_MESSAGE_SOCKET_HISTORY: ChatMessage = {
  messageId: 1,
  messageType: "TEXT",
  senderId: 2,
  content: "이전",
  imageUrls: [],
  createdAt: "2025-12-01T00:00:00.000Z",
};

/** 캐시에 웹소켋 messageId와 동일한 메시지가 이미 있을 때 */
export const MOCK_CHAT_MESSAGE_WS_ALREADY_PRESENT: ChatMessage = {
  messageId: 100,
  messageType: "TEXT",
  senderId: 2,
  content: "안녕",
  imageUrls: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

/** ChatRoomMain 등 UI 테스트: 단일 텍스트 표시용 */
export const MOCK_CHAT_MESSAGE_UI_TEXT: ChatMessage = {
  ...MOCK_CHAT_MESSAGES[0],
  content: "테스트 메시지",
};

/** 이미지 두 장 첨부 메시지 */
export const MOCK_CHAT_MESSAGE_IMAGE_PAIR: ChatMessage = {
  ...MOCK_CHAT_MESSAGES[0],
  content: "",
  messageType: "IMAGE",
  imageUrls: ["image1.jpg", "image2.jpg"],
};

/** 여러 ChatBox 렌더링 시나리오 (4건) */
export const MOCK_CHAT_MESSAGES_FOUR: ChatMessage[] = [
  ...MOCK_CHAT_MESSAGES,
  {
    ...MOCK_CHAT_MESSAGES[0],
    messageId: 3,
    content: "메시지 3",
    createdAt: "2026-01-15T14:02:00.000Z",
  },
  {
    ...MOCK_CHAT_MESSAGES[1],
    messageId: 4,
    content: "메시지 4",
    createdAt: "2026-01-15T14:03:00.000Z",
  },
];

/** 연속 동일 발신자 nextSender 검증용 3건 */
export const MOCK_CHAT_MESSAGES_THREE_NEXT_SENDER_CHAIN: ChatMessage[] = [
  { ...MOCK_CHAT_MESSAGES[0], content: "첫 번째" },
  {
    ...MOCK_CHAT_MESSAGES[0],
    messageId: 2,
    content: "두 번째",
    createdAt: "2026-01-15T14:01:00.000Z",
  },
  {
    ...MOCK_CHAT_MESSAGES[1],
    messageId: 3,
    content: "세 번째",
    createdAt: "2026-01-15T14:02:00.000Z",
  },
];
