import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import {
  ChatListType,
  ChatRoom,
  ChatRoomResponse,
  WebSocketChatMessage,
} from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";

export const MOCK_CHAT_ITEM: ChatRoom = {
  roomId: 1,
  contactUser: {
    userId: 1,
    nickname: "사용자 닉네임",
    profileImageUrl: null,
  },
  postInfo: {
    postId: 1,
    postType: "LOST",
    category: "WALLET",
    title: "테스트 게시글",
    address: "서울시 강남구 신사동",
    thumbnailUrl: null,
    deleted: false,
    postStatus: "SEARCHING",
  },
  messageType: "TEXT",
  lastMessage:
    "안녕하세요! 혹시 올리신 검정색 카드 지갑, 명동에서 발견하신 지갑이실까요? 혹시나 해서",
  lastMessageSentAt: "2026-01-01T10:00:00.000Z",
  unreadCount: 1,
};

export const MOCK_CHAT_LIST_FIRST_PAGE_RESPONSE: ApiBaseResponseType<ChatListType> = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    chatRooms: [MOCK_CHAT_ITEM],
    nextCursor: null,
  },
};

export const MOCK_CHAT_LIST_EMPTY_RESPONSE: ApiBaseResponseType<ChatListType> = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    chatRooms: [],
    nextCursor: null,
  },
};

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

/** findOptimisticMessage IMAGE 매칭 등용 웹소켓 IMAGE 페이로드 */
export const MOCK_WS_CHAT_MESSAGE_IMAGE_TWO: WebSocketChatMessage = {
  ...MOCK_WS_CHAT_MESSAGE,
  messageType: "IMAGE",
  content: "",
  imageUrls: ["a.jpg", "b.jpg"],
};

export const MOCK_WS_CHAT_MESSAGE_IMAGE_NO_URLS: WebSocketChatMessage = {
  ...MOCK_WS_CHAT_MESSAGE,
  messageType: "IMAGE",
  content: "",
  imageUrls: undefined,
};

export const MOCK_WS_CHAT_MESSAGE_IMAGE_SINGLE: WebSocketChatMessage = {
  ...MOCK_WS_CHAT_MESSAGE,
  messageType: "IMAGE",
  content: "",
  imageUrls: ["only-one.jpg"],
};

/** transformWebSocketMessage 단위 테스트용 (roomId·undefined imageUrls) */
export const MOCK_WS_CHAT_MESSAGE_FOR_TRANSFORM_TEXT: WebSocketChatMessage = {
  messageId: 10,
  roomId: 99,
  senderId: 3,
  content: "hi",
  messageType: "TEXT",
  createdAt: "2026-02-01T12:00:00.000Z",
  imageUrls: undefined,
};

export const MOCK_WS_CHAT_MESSAGE_FOR_TRANSFORM_IMAGE: WebSocketChatMessage = {
  messageId: 1,
  roomId: 1,
  senderId: 1,
  content: "",
  messageType: "IMAGE",
  createdAt: "2026-01-01T00:00:00.000Z",
  imageUrls: ["x.png", "y.png"],
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

/** MOCK_WS_CHAT_MESSAGE와 발신·내용이 같고 양수 id (낙관적 없음 시나리오) */
export const MOCK_CHAT_MESSAGE_CONFIRMED_MATCHING_WS_TEXT: ChatMessage = {
  messageId: 1,
  messageType: "TEXT",
  senderId: MOCK_WS_CHAT_MESSAGE.senderId,
  content: MOCK_WS_CHAT_MESSAGE.content,
  imageUrls: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const MOCK_CHAT_MESSAGE_OPTIMISTIC_TEXT_CONTENT_MISMATCH: ChatMessage = {
  ...MOCK_CHAT_MESSAGE_OPTIMISTIC,
  messageId: -2,
  content: "다름",
};

export const MOCK_CHAT_MESSAGE_OPTIMISTIC_TEXT_SENDER_MISMATCH: ChatMessage = {
  ...MOCK_CHAT_MESSAGE_OPTIMISTIC,
  messageId: -3,
  senderId: 99,
};

/** IMAGE 낙관적 매칭 테스트용 (로컬 URL만 다르고 개수 동일) */
export const MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_LOCAL: ChatMessage = {
  messageId: -9,
  messageType: "IMAGE",
  senderId: MOCK_WS_CHAT_MESSAGE.senderId,
  content: "",
  imageUrls: ["local1", "local2"],
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_EMPTY_URLS: ChatMessage = {
  messageId: -1,
  messageType: "IMAGE",
  senderId: MOCK_WS_CHAT_MESSAGE.senderId,
  content: "",
  imageUrls: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

/** 웹소켓 1장 vs 낙관적 2장 불일치 시나리오 */
export const MOCK_CHAT_MESSAGE_OPTIMISTIC_IMAGE_TWO_URLS_FOR_MISMATCH: ChatMessage = {
  messageId: -1,
  messageType: "IMAGE",
  senderId: MOCK_WS_CHAT_MESSAGE.senderId,
  content: "",
  imageUrls: ["a", "b"],
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

/** chatMessageCache.addMessageToCache 테스트용 신규 메시지 */
export const MOCK_CHAT_MESSAGE_CACHE_PREPEND_INCOMING: ChatMessage = {
  messageId: 99,
  messageType: "TEXT",
  senderId: 1,
  content: "새 메시지",
  imageUrls: [],
  createdAt: "2026-06-01T00:00:00.000Z",
};

/** chatMessageCache.replaceMessageInCache 서버 확정 교체 결과 */
export const MOCK_CHAT_MESSAGE_AFTER_SERVER_REPLACE: ChatMessage = {
  ...MOCK_CHAT_MESSAGES[0],
  messageId: 100,
  content: "서버 확정",
};

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
