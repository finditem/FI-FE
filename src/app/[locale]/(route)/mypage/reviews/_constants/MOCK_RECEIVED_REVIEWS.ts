import type { ReviewCardData } from "../_types/ReviewCardData";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

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
