import { shouldRegisterWebPushServiceWorker } from "../shouldRegisterWebPushServiceWorker/shouldRegisterWebPushServiceWorker";

const WEB_PUSH_SERVICE_WORKER_URL = "/sw.js";

/**
 * 푸시용 서비스 워커(`/sw.js`, scope `/`)를 등록합니다.
 *
 * @returns 등록된 `ServiceWorkerRegistration`, 조건 미충족·실패 시 `null`
 *
 * @remarks
 * - `navigator.serviceWorker`가 없거나 {@link shouldRegisterWebPushServiceWorker}가 `false`면 등록하지 않습니다.
 * - 등록 중 예외는 삼키고 `null`을 반환합니다.
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * const registration = await registerWebPushServiceWorker();
 * if (!registration) return;
 * const sub = await registration.pushManager.getSubscription();
 * ```
 */

export const registerWebPushServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;
  if (!shouldRegisterWebPushServiceWorker()) return null;

  try {
    return await navigator.serviceWorker.register(WEB_PUSH_SERVICE_WORKER_URL, { scope: "/" });
  } catch {
    return null;
  }
};
