export function shouldRegisterWebPushServiceWorker(): boolean {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_API_MOCKING !== "enabled";
}
