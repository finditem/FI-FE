import type { GetNoticeCommentsResponse } from "@/api/fetch/noticeComment/types/GetNoticeComments";
import type { NoticeDetail, NoticeDetailResponse } from "@/api/fetch/notice/types/NoticeDetailType";
import { GetNoticesResponse, NoticeItem } from "@/api/fetch/notice/types/NoticesType";
import type { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";

export const MOCK_NOTICE_ITEM: NoticeItem = {
  noticeId: 1,
  title: "서비스 점검 안내",
  category: "MAINTENANCE",
  pinned: true,
  viewCount: 100,
  likeCount: 12,
  thumbnailUrl: null,
  createdAt: "2024-01-01T00:00:00",
  isNew: true,
  isHot: false,
};

export const MOCK_NOTICE_ITEMS: NoticeItem[] = [
  {
    noticeId: 1,
    title: "서비스 점검 안내",
    category: "MAINTENANCE",
    pinned: true,
    viewCount: 320,
    likeCount: 24,
    thumbnailUrl: null,
    createdAt: "2025-03-01T09:00:00",
    isNew: true,
    isHot: true,
  },
  {
    noticeId: 2,
    title: "이벤트: 분실물 찾기 캠페인",
    category: "EVENT",
    pinned: true,
    viewCount: 156,
    likeCount: 42,
    thumbnailUrl: null,
    createdAt: "2025-02-28T14:30:00",
    isNew: true,
    isHot: false,
  },
  {
    noticeId: 3,
    title: "앱 업데이트 안내 (v1.2.0)",
    category: "UPDATE",
    pinned: false,
    viewCount: 89,
    likeCount: 8,
    thumbnailUrl: null,
    createdAt: "2025-02-25T11:00:00",
    isNew: false,
    isHot: false,
  },
  {
    noticeId: 4,
    title: "개인정보 처리방침 변경 안내",
    category: "IMPORTANT",
    pinned: false,
    viewCount: 234,
    likeCount: 5,
    thumbnailUrl: null,
    createdAt: "2025-02-20T16:00:00",
    isNew: false,
    isHot: true,
  },
  {
    noticeId: 5,
    title: "일반 공지사항 안내",
    category: "GENERAL",
    pinned: false,
    viewCount: 67,
    likeCount: 3,
    thumbnailUrl: null,
    createdAt: "2025-02-15T10:00:00",
    isNew: false,
    isHot: false,
  },
];

export const MOCK_NOTICES_RESPONSE_FIRST_PAGE: GetNoticesResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    content: MOCK_NOTICE_ITEMS.slice(0, 3),
    nextCursor: 4,
    hasNext: true,
  },
};

export const MOCK_NOTICES_RESPONSE_LAST_PAGE: GetNoticesResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    content: MOCK_NOTICE_ITEMS,
    nextCursor: null,
    hasNext: false,
  },
};

export const MOCK_NOTICES_RESPONSE: GetNoticesResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    content: MOCK_NOTICE_ITEMS,
    nextCursor: null,
    hasNext: false,
  },
};

/** 공지 상세 헤더 스토리용 `NoticeDetail.result` 기본값 (`noticeId`는 응답 생성 시 덮어씁니다) */
export const MOCK_NOTICE_DETAIL_HEADER_RESULT: NoticeDetail = {
  noticeId: 1,
  title: "서비스 점검 안내",
  content: "점검 시간 동안 서비스 이용이 제한될 수 있습니다.",
  summary: "점검 안내",
  category: "MAINTENANCE",
  pinned: true,
  viewCount: 128,
  likeCount: 14,
  commentCount: 2,
  authorName: "관리자",
  thumbnailUrl: "",
  images: [],
  isNew: true,
  isHot: false,
  createdAt: "2025-03-01T09:00:00",
  updatedAt: "2025-03-01T09:00:00",
  likeStatus: false,
};

export const createMockNoticeDetailHeaderResponse = (id: number): NoticeDetailResponse => ({
  isSuccess: true,
  code: "COMMON200",
  message: "성공",
  result: { ...MOCK_NOTICE_DETAIL_HEADER_RESULT, noticeId: id },
});

const USERS_ME_NOTICE_HEADER_PROFILE = {
  userId: 1,
  nickname: "테스트유저",
  email: "test@example.com",
  profileImg: "",
  socialUser: false,
} as const;

/** 공지 상세 헤더 스토리용 `users-me` 쿼리 (일반 사용자) */
export const MOCK_USERS_ME_NOTICE_HEADER_USER: GetUsersMeResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공",
  result: { ...USERS_ME_NOTICE_HEADER_PROFILE, role: "USER" },
};

/** 공지 상세 헤더 스토리용 `users-me` 쿼리 (관리자) */
export const MOCK_USERS_ME_NOTICE_HEADER_ADMIN: GetUsersMeResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공",
  result: { ...USERS_ME_NOTICE_HEADER_PROFILE, role: "ADMIN" },
};

/** NoticeDetailHeader 테스트에서 `useGetNoticeDetail` mock에 넘기는 `result` 최소 필드 */
export const MOCK_NOTICE_DETAIL_HEADER_TEST_HOOK_RESULT = {
  title: "테스트 공지",
  content: "본문 내용",
  thumbnailUrl: "",
  likeCount: 2,
  commentCount: 3,
  viewCount: 10,
};

/** 공지 댓글 무한 쿼리 시드용 — 빈 첫 페이지 */
export const MOCK_NOTICE_COMMENTS_EMPTY_FIRST_PAGE: GetNoticeCommentsResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    comments: [],
    hasNext: false,
    cursor: 0,
  },
};
