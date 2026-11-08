/**
 * 경찰청 공공데이터(분실/습득) 상세 목 데이터.
 *
 * @remarks
 * - 서버 프리패치 경로(`/api/public/{type}`)를 가로채는 SSR MSW 핸들러가 사용한다.
 * - 응답 형태는 `/api/public/*` 라우트와 동일한 `{ items: { item } }`이며, 클라이언트
 *   `usePublicDataDetailQuery`가 `data.items?.item`을 읽는다.
 * - 분실 상세 값은 `tests/e2e/public-data-page.spec.ts`의 상세 검증과 일치시킨다.
 */

export interface PublicDataMockItem {
  atcId: string;
  fdPrdtNm: string;
  prdtClNm: string;
  fdYmd: string;
  tel: string;
  fdFilePathImg: string;
  depPlace?: string;
  fdPlace?: string;
  fdSbjt?: string;
  uniq?: string;
}

export interface PublicDataMockResponse {
  items: { item: PublicDataMockItem };
}

export const MOCK_PUBLIC_LOST_ITEM: PublicDataMockItem = {
  atcId: "L2024001",
  depPlace: "서울 중부경찰서",
  fdFilePathImg: "",
  fdPrdtNm: "갤럭시 스마트폰",
  fdSbjt: "강남구 역삼동에서 분실",
  fdYmd: "20240115",
  prdtClNm: "전자기기",
  tel: "02-1234-5678",
};

export const MOCK_PUBLIC_FOUND_ITEM: PublicDataMockItem = {
  atcId: "F2024001",
  fdPlace: "부산 해운대경찰서",
  fdFilePathImg: "",
  fdPrdtNm: "애플 노트북",
  uniq: "해운대 해수욕장에서 습득",
  fdYmd: "20240116",
  prdtClNm: "전자기기",
  tel: "051-1234-5678",
};

/** 요청 atcId를 반영한 분실/습득 상세 응답을 만든다. */
export const buildPublicDetailResponse = (
  type: "lost" | "found",
  atcId: string
): PublicDataMockResponse => {
  const base = type === "lost" ? MOCK_PUBLIC_LOST_ITEM : MOCK_PUBLIC_FOUND_ITEM;
  return { items: { item: { ...base, atcId: atcId || base.atcId } } };
};
