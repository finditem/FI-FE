const HOUR_IN_MS = 60 * 60 * 1000;

/**
 * 번역 횟수 제한 토스트(5-1)에 노출할 "다시 사용 가능까지 남은 시간"을 시간 단위로 반환합니다.
 *
 * @remarks
 * 일일 번역 횟수는 매일 초기화되므로, 백엔드 이용 이력 연동 전까지는 로컬 자정까지 남은
 * 시간을 임시 값으로 사용합니다. 서버가 실제 재사용 가능 시점을 내려주면 이 계산을 대체합니다.
 * 남은 시간은 올림 처리하며 최소 1시간으로 보정합니다.
 */
const getTranslationResetHours = (now: Date = new Date()): number => {
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const remainingHours = Math.ceil((nextMidnight.getTime() - now.getTime()) / HOUR_IN_MS);
  return Math.max(1, remainingHours);
};

export default getTranslationResetHours;
