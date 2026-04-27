/**
 * MSW 등으로 API를 모킹하는 로컬 환경에서는 서비스 워커 등록을 건너뛸지 결정합니다.
 *
 * @returns `NEXT_PUBLIC_API_MOCKING === "enabled"`이면 `false`, 그 외(및 브라우저)에서는 `true`
 *
 * @remarks
 * - SSR(`typeof window === "undefined"`)에서는 `false`입니다.
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * // registerWebPushServiceWorker 내부: MSW 켜진 로컬에선 등록 생략
 * if (!shouldRegisterWebPushServiceWorker()) return null;
 * ```
 */

export const shouldRegisterWebPushServiceWorker = (): boolean => {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_API_MOCKING !== "enabled";
};
