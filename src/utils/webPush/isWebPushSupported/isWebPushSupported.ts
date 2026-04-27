/**
 * 브라우저가 Web Push 구독에 필요한 API를 갖췄는지 여부를 반환합니다.
 *
 * @returns `window`·보안 컨텍스트·`serviceWorker`·`PushManager`가 모두 있으면 `true`
 *
 * @remarks
 * - SSR(`typeof window === "undefined"`)에서는 항상 `false`입니다.
 * - `http://localhost`는 보안 컨텍스트로 취급되는 경우가 많습니다.
 * 
 * @author hyungjun
 * /

/**
 * @example
 * ```ts
 * if (!isWebPushSupported()) return;
 * await syncWebPushSubscription();
 * ```
 */

export const isWebPushSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!window.isSecureContext) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;
  return true;
};
