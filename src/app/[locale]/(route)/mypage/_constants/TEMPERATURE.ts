import type { TemperatureTier } from "../_types/TemperatureTier";

/** 가입 시 시작하는 찾길 온도 */
export const FIRST_TEMPERATURE = 36.5;

/** 찾길 온도 최댓값. 막대의 오른쪽 끝이다. */
export const MAX_TEMPERATURE = 99;

const CHARACTER_DIR = "/mypage/temperature";

/**
 * 구간별 캐릭터 이미지 경로.
 * Figma의 캐릭터가 비트맵 이미지라 아이콘 스프라이트 대신 4배 크기 webp로 두고, `next/image`의 재압축 없이(`unoptimized`) 쓴다.
 * 36.6~50 구간과 50.1~69.9 구간은 같은 캐릭터를 쓴다.
 */
export const TEMPERATURE_CHARACTER: Record<TemperatureTier, string> = {
  low: `${CHARACTER_DIR}/mypage-temperature-low.webp`,
  first: `${CHARACTER_DIR}/mypage-temperature-default.webp`,
  rising: `${CHARACTER_DIR}/mypage-temperature-50.webp`,
  good: `${CHARACTER_DIR}/mypage-temperature-50.webp`,
  trusted: `${CHARACTER_DIR}/mypage-temperature-99.webp`,
  max: `${CHARACTER_DIR}/mypage-temperature-max.webp`,
};
