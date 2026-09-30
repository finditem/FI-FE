/**
 * 서버가 받는 지도 레벨의 범위입니다. 백엔드 `MapLevel` enum이 1에서 8까지만 정의되어 있습니다.
 */
const SERVER_MAP_LEVEL_MIN = 1;
const SERVER_MAP_LEVEL_MAX = 8;

/**
 * 네이버 지도 줌 레벨을 서버 지도 API가 받는 레벨로 변환하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 서버 지도 API는 카카오 레벨 체계(작을수록 확대)로 `level`을 받으므로 `level = 20 - zoom`으로 되돌립니다.
 * - 결과를 1에서 8 사이로 제한합니다. 백엔드 DTO는 11까지 허용하지만 9 이상은 서버에서 예외가 납니다.
 * - 하한이 없으면 줌 20 이상에서 0 이하가 되어 조회가 멈추거나 음수가 서버로 전달됩니다.
 *
 * @param zoom - 네이버 지도 줌 레벨
 *
 * @returns 서버 지도 API에 보낼 레벨 (1에서 8)
 *
 * @author junyeol
 */

/**
 * @example
 * ```ts
 * getServerMapLevel(15); // 5
 * getServerMapLevel(21); // 1
 * getServerMapLevel(7); // 8
 * ```
 */

export const getServerMapLevel = (zoom: number): number =>
  Math.min(Math.max(20 - zoom, SERVER_MAP_LEVEL_MIN), SERVER_MAP_LEVEL_MAX);
