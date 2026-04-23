import publicApi from "@/api/_base/axios/publicApi";
import authApi from "@/api/_base/axios/authApi";
import type {
  GetPushVapidKeyResponse,
  PostPushSubscribeRequest,
} from "@/api/fetch/webPush/types/webPushType";
import { pickVapidPublicKey } from "./pickVapidPublicKey";
import { registerWebPushServiceWorker } from "./registerWebPushServiceWorker";
import { isWebPushSupported } from "./isWebPushSupported";
import { urlBase64ToUint8Array } from "./urlBase64ToUint8Array";

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
