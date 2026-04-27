import publicApi from "@/api/_base/axios/publicApi";
import authApi from "@/api/_base/axios/authApi";
import type {
  GetPushVapidKeyResponse,
  PostPushSubscribeRequest,
} from "@/api/fetch/webPush/types/webPushType";
import { pickVapidPublicKey } from "../pickVapidPublicKey/pickVapidPublicKey";
import { registerWebPushServiceWorker } from "../registerWebPushServiceWorker/registerWebPushServiceWorker";
import { isWebPushSupported } from "../isWebPushSupported/isWebPushSupported";
import { urlBase64ToUint8Array } from "../urlBase64ToUint8Array/urlBase64ToUint8Array";

/**
 * VAPID 키를 받아 `pushManager.subscribe`로 구독을 만든 뒤, 서버 `/push/subscribe`에 등록합니다.
 *
 * @throws VAPID 응답 실패·구독 키 불완전·서버 등록 실패 시 `Error`
 *
 * @remarks
 * - {@link isWebPushSupported}·{@link registerWebPushServiceWorker} 단계에서 막히면 조용히 반환합니다.
 * - `applicationServerKey`는 {@link urlBase64ToUint8Array}·{@link pickVapidPublicKey}로 준비합니다.
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * useEffect(() => {
 *   void syncWebPushSubscription().catch(console.error);
 * }, []);
 * ```
 */

export const syncWebPushSubscription = async (): Promise<void> => {
  if (!isWebPushSupported()) return;

  const registration = await registerWebPushServiceWorker();
  if (!registration) return;

  const { data: vapidRes } = await publicApi.get<GetPushVapidKeyResponse>("/push/vapid-key");
  if (!vapidRes?.isSuccess || !vapidRes.result) {
    throw new Error("Failed to load VAPID public key");
  }

  const applicationServerKey = urlBase64ToUint8Array(pickVapidPublicKey(vapidRes.result));

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey as BufferSource,
  });

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Invalid PushSubscription keys");
  }

  const body: PostPushSubscribeRequest = {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  };

  const { data: subRes } = await authApi.post("/push/subscribe", body);
  if (!subRes?.isSuccess) {
    throw new Error("Failed to register push subscription on server");
  }
};
