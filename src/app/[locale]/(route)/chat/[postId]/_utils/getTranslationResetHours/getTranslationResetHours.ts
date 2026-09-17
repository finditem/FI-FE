const HOUR_IN_MS = 60 * 60 * 1000;

const getLocalMidnight = (now: Date): Date => {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight;
};

/**
 * 번역 횟수 제한 토스트(5-1)에 노출할 "다시 사용 가능까지 남은 시간"을 시간 단위로 반환합니다.
 *
 * @remarks
 * 서버가 내려주는 재사용 가능 시각(`nextAvailableAt`, ISO 8601)을 기준으로 계산합니다.
 * 값이 없거나 파싱할 수 없으면(사용량 조회 전 등) 로컬 자정까지 남은 시간으로 폴백합니다.
 * 남은 시간은 올림 처리하며 최소 1시간으로 보정합니다.
 */
const getTranslationResetHours = (nextAvailableAt?: string, now: Date = new Date()): number => {
  const parsed = nextAvailableAt ? new Date(nextAvailableAt) : null;
  const target = parsed && !Number.isNaN(parsed.getTime()) ? parsed : getLocalMidnight(now);
  const remainingHours = Math.ceil((target.getTime() - now.getTime()) / HOUR_IN_MS);
  return Math.max(1, remainingHours);
};

export default getTranslationResetHours;
