import { Radius } from "@/types";

/**
 * 반경 값에 대응하는 카카오맵 레벨을 반환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 반경-레벨 매핑: 1000m > 6, 3000m > 7, 5000m > 8
 * - `Radius` 타입 범위(1000 | 3000 | 5000) 외의 값이 전달되면 레벨 6을 반환합니다.
 *
 * @param radius - 반경 값 (단위: m)
 *
 * @returns 카카오맵 레벨
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * getMapLevelByRadius(1000); // 6
 * getMapLevelByRadius(3000); // 7
 * getMapLevelByRadius(5000); // 8
 * ```
 */

export const getMapLevelByRadius = (radius: Radius): number => {
  if (radius <= 1000) return 6;
  if (radius <= 3000) return 7;
  if (radius <= 5000) return 8;
  return 6;
};
