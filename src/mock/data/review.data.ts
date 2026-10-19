import type { ReviewDetailResponse } from "@/api/fetch/review";
import type { ReviewCardData } from "@/types";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const MOCK_REVIEW_CARD: ReviewCardData = {
  id: 1,
  nickname: "우주강아지",
  location: "성동구 성수1동",
  createdAt: "2026-07-22T10:00:00.000Z",
  content: "늦은 밤에 연락드렸는데 흔쾌히 나와주셔서 감사했어요.",
  tagLabel: "친절하고 따뜻하게 대해주셨어요.",
  extraTagCount: 1,
};

export const MOCK_REVIEW_DETAIL: ReviewDetailResponse = {
  reviewId: 1,
  emotion: "GRATEFUL",
  helpTypes: ["KIND_AND_WARM", "SAFE_STORAGE"],
  content: "늦은 밤에 연락드렸는데 흔쾌히 나와주셔서 감사했어요.",
  createdAt: "2026-07-22T10:00:00",
  author: {
    userId: 3,
    nickname: "우주강아지",
    profileImageUrl: null,
    withdrawn: false,
  },
  recipient: {
    userId: 5,
    nickname: "성수317",
    profileImageUrl: null,
    withdrawn: false,
  },
  post: {
    postId: 7,
    title: "휴대폰, 검정색 카드지갑 가죽케이스",
    address: "서울 성동구 성수동",
    thumbnailUrl: null,
    date: "2025-11-11T10:00:00",
    createdAt: "2025-11-11T11:00:00",
    deleted: false,
  },
  roomId: 2,
};

// TODO(수현): 후기 리스트 백엔드 API 연동 후 제거 — Figma 받은 후기 리스트(node 16664-86655) 더미 데이터
export const MOCK_RECEIVED_REVIEWS: ReviewCardData[] = [
  {
    id: 1,
    nickname: "우주강아지",
    location: "성동구 성수1동",
    createdAt: minutesAgo(30),
    content:
      "카페에 파란색 지갑을 두고 나와서 온종일 발만 동동굴렀는데, 물건 분실 등록하자마자 바로 아전히 보관 중...",
    tagLabel: "친절하고 따뜻하게 대해주셨어요.",
    extraTagCount: 1,
  },
  {
    id: 2,
    nickname: "우주강아지",
    location: "성동구 성수1동",
    createdAt: minutesAgo(30),
    content:
      "카페에 파란색 지갑을 두고 나와서 온종일 발만 동동굴렀는데, 물건 분실 등록하자마자 바로 아전히 보관 중...",
    tagLabel: "친절하고 따뜻하게 대해주셨어요.",
    extraTagCount: 1,
  },
];
