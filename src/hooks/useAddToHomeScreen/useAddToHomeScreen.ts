"use client";

import { usePWA } from "@/providers/PWAProvider";

/**
 * 홈 화면 추가(PWA 설치) 기능을 제공하는 커스텀 훅입니다.
 *
 * @remarks
 * - 내부적으로 `usePWA`를 위임하며, `PWAProvider` 하위에서만 사용해야 합니다.
 *
 * @returns PWA 설치 관련 상태 및 핸들러 객체 (`usePWA` 반환값과 동일)
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const { canInstall, installApp } = useAddToHomeScreen();
 *
 * if (canInstall) {
 *   return <button onClick={installApp}>홈 화면에 추가</button>;
 * }
 * ```
 */

export const useAddToHomeScreen = () => {
  return usePWA();
};

export default useAddToHomeScreen;
