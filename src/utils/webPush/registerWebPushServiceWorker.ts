import { shouldRegisterWebPushServiceWorker } from "./shouldRegisterWebPushServiceWorker";

const WEB_PUSH_SERVICE_WORKER_URL = "/sw.js";

export async function registerWebPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  if (!shouldRegisterWebPushServiceWorker()) return null;

  try {
    return await navigator.serviceWorker.register(WEB_PUSH_SERVICE_WORKER_URL, { scope: "/" });
  } catch {
    return null;
  }
}
