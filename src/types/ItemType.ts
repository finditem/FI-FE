/**
 * 게시글 및 아이템과 관련된 타입 정의입니다.
 *
 * @author jikwon
 */

/**
 * 아이템 카테고리 타입
 * - ELECTRONICS: 전자기기
 * - WALLET: 지갑
 * - ID_CARD: 신분증
 * - JEWELRY: 귀금속
 * - BAG: 가방
 * - CARD: 카드
 * - ETC: 기타
 */

export type CategoryType =
  | "ELECTRONICS"
  | "WALLET"
  | "ID_CARD"
  | "JEWELRY"
  | "BAG"
  | "CARD"
  | "ETC";

/**
 * 게시글 타입
 * - LOST: 분실 게시글
 * - FOUND: 제보 게시글
 */

export type PostType = "LOST" | "FOUND";

/**
 * 아이템 찾기 상태
 * - SEARCHING: 찾는 중
 * - FOUND: 찾았음
 */

export type ItemStatus = "SEARCHING" | "FOUND";

/**
 * 마이페이지 활동 내역 타입
 * - POST: 게시글
 * - COMMENT: 댓글
 * - FAVORITE: 즐겨찾기
 * - INQUIRY: 문의
 * - REPORT: 신고
 */

export type ActivityType = "POST" | "COMMENT" | "FAVORITE" | "INQUIRY" | "REPORT";

/**
 * 간단 정렬 타입
 * - LATEST: 최신순
 * - OLDEST: 오래된순
 */

export type SimpleSortType = "LATEST" | "OLDEST";
