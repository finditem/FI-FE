import { Radius } from "@/types";

/**
 * 반경 값에 대응하는 네이버 지도 줌 레벨을 반환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 반경-줌 매핑: 1000m > 14, 3000m > 13, 5000m > 12
 * - 카카오 레벨 6, 7, 8을 `zoom = 20 - level`로 옮긴 값입니다. 근거는 `docs/naver-map/migration-from-kakao.md`에 있습니다.
 * - `Radius` 타입 범위(1000 | 3000 | 5000) 외의 값이 전달되면 줌 14를 반환합니다.
 *
 * @param radius - 반경 값 (단위: m)
 *
 * @returns 네이버 지도 줌 레벨
 *
 * @author junyeol
 */

/**
 * @example
 * ```ts
 * getMapZoomByRadius(1000); // 14
 * getMapZoomByRadius(3000); // 13
 * getMapZoomByRadius(5000); // 12
 * ```
 */

export const getMapZoomByRadius = (radius: Radius): number => {
  if (radius <= 1000) return 14;
  if (radius <= 3000) return 13;
  if (radius <= 5000) return 12;
  return 14;
};
