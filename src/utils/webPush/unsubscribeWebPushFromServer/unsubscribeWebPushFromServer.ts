import authApi from "@/api/_base/axios/authApi";
import { isWebPushSupported } from "../isWebPushSupported/isWebPushSupported";

/**
 * 서버에 저장된 푸시 구독을 DELETE로 제거한 뒤, 클라이언트 `PushSubscription`을 해지합니다.
 *
 * @remarks
 * - {@link isWebPushSupported}가 `false`이거나 `serviceWorker`/등록/구독이 없으면 아무 것도 하지 않습니다.
 * - `authApi.delete` 실패 여부와 관계없이 `finally`에서 `subscription.unsubscribe()`를 시도합니다.
 *
 * @example
 * ```ts
 * // 로그아웃 직전 등
 * await unsubscribeWebPushFromServer();
 * ```
 *
 * @author hyungjun
 */

export const unsubscribeWebPushFromServer = async (): Promise<void> => {
  if (!isWebPushSupported()) return;
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;

  try {
    await authApi.delete(`/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`);
  } finally {
    try {
      await subscription.unsubscribe();
    } catch {
      // ignore
    }
  }
};
