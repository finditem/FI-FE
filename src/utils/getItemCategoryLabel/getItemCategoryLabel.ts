import { CategoryType } from "@/types";

/**
 * 카테고리 타입을 사용자에게 표시할 라벨로 변환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 카테고리-라벨 매핑
 *  - ELECTRONICS > "전자기기"
 *  - WALLET > "지갑"
 *  - ID_CARD > "신분증"
 *  - JEWELRY > "귀금속"
 *  - BAG > "가방"
 *  - CARD > "카드"
 *  - ETC > "기타"
 *
 * @param category - 카테고리 타입
 *
 * @returns 카테고리에 해당하는 한국어 라벨
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * getItemCategoryLabel("ELECTRONICS"); // "전자기기"
 * getItemCategoryLabel("ETC");         // "기타"
 * ```
 */

export const getItemCategoryLabel = (category: CategoryType): string => {
  const CATEGORY_LABEL: Record<CategoryType, string> = {
    ELECTRONICS: "전자기기",
    WALLET: "지갑",
    ID_CARD: "신분증",
    JEWELRY: "귀금속",
    BAG: "가방",
    CARD: "카드",
    ETC: "기타",
  };

  return CATEGORY_LABEL[category];
};
