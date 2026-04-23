import authApi from "@/api/_base/axios/authApi";
import { isWebPushSupported } from "./isWebPushSupported";

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
