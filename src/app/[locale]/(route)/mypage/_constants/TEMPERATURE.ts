import type { TemperatureTier } from "../_types/TemperatureTier";

/** 가입 시 시작하는 찾길 온도 */
export const FIRST_TEMPERATURE = 36.5;

/** 찾길 온도 최댓값. 막대의 오른쪽 끝이다. */
export const MAX_TEMPERATURE = 99;

const CHARACTER_DIR = "/mypage/temperature";

/**
 * 구간별 캐릭터 이미지 경로.
 * Figma에서 받은 SVG가 래스터 이미지를 감싼 형태라, 아이콘 스프라이트 대신 PNG로 바꿔 `next/image`로 쓴다.
 * 36.6~50 구간과 50.1~69.9 구간은 같은 캐릭터를 쓴다.
 */
export const TEMPERATURE_CHARACTER: Record<TemperatureTier, string> = {
  low: `${CHARACTER_DIR}/mypage-temperature-low.png`,
  first: `${CHARACTER_DIR}/mypage-temperature-default.png`,
  rising: `${CHARACTER_DIR}/mypage-temperature-50.png`,
  good: `${CHARACTER_DIR}/mypage-temperature-50.png`,
  trusted: `${CHARACTER_DIR}/mypage-temperature-99.png`,
  max: `${CHARACTER_DIR}/mypage-temperature-max.png`,
};
