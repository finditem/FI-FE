import { FIRST_TEMPERATURE, MAX_TEMPERATURE } from "../../_constants/TEMPERATURE";
import type { TemperatureTier } from "../../_types/TemperatureTier";

/**
 * 찾길 온도를 문구, 캐릭터, 색상을 고르는 구간 키로 바꿉니다.
 *
 * @remarks
 * 구간 경계는 Figma `Card1` 변형 이름(36.5 미만, 36.5, 36.6-50, 50.1-69.9, 70-98.9, 99)을 따릅니다.
 * 온도는 소수 첫째 자리까지 내려온다고 가정합니다.
 *
 * @param temperature 찾길 온도
 *
 * @example
 * ```ts
 * getTemperatureTier(36.5); // "first"
 * getTemperatureTier(84); // "trusted"
 * ```
 */
export const getTemperatureTier = (temperature: number): TemperatureTier => {
  if (temperature < FIRST_TEMPERATURE) return "low";
  if (temperature === FIRST_TEMPERATURE) return "first";
  if (temperature <= 50) return "rising";
  if (temperature < 70) return "good";
  if (temperature < MAX_TEMPERATURE) return "trusted";
  return "max";
};
