import type { IconName } from "@/components/common/Icon";
import type { CategoryType } from "@/types";

/**
 * 게시글 카테고리 아이콘 매핑입니다.
 *
 * @author jikwon
 */

/**
 * 이미지가 없는 목록 아이템의 기본 이미지로 쓰는 카테고리 타일 아이콘입니다.
 * 90×90 타일(배경 사각형 + 흰색 글리프) 구조라 배경색을 지정해 사용합니다.
 */
export const CATEGORY_TILE_ICON_MAP: Record<CategoryType, IconName> = {
  ELECTRONICS: "Electronics",
  WALLET: "Wallet",
  ID_CARD: "IdCard",
  JEWELRY: "Jewelry",
  BAG: "Bag",
  CARD: "Card",
  ETC: "Etc",
};

/**
 * 카테고리 선택 UI에서 쓰는 24×24 라인 아이콘입니다.
 * `currentColor`를 따르므로 선택 상태에 맞춰 글자색으로 색을 바꿉니다.
 */
export const CATEGORY_SELECT_ICON_MAP: Record<CategoryType, IconName> = {
  ELECTRONICS: "CategoryElectronics",
  WALLET: "CategoryWallet",
  ID_CARD: "CategoryIdCard",
  JEWELRY: "CategoryJewelry",
  BAG: "CategoryBag",
  CARD: "CategoryCard",
  ETC: "CategoryEtc",
};
