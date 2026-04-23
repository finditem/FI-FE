import { ItemStatus } from "@/types";

/**
 * 아이템 상태 타입을 사용자에게 표시할 라벨로 변환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 상태-라벨 매핑: SEARCHING > "찾아요", FOUND > "찾았어요"
 *
 * @param status - 아이템 상태 타입
 *
 * @returns 상태에 해당하는 한국어 라벨
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * getItemStatusLabel("SEARCHING"); // "찾아요"
 * getItemStatusLabel("FOUND");     // "찾았어요"
 * ```
 */

export const getItemStatusLabel = (status: ItemStatus): string => {
  const STATUS_LABEL: Record<ItemStatus, string> = {
    SEARCHING: "찾아요",
    FOUND: "찾았어요",
  };

  return STATUS_LABEL[status];
};
