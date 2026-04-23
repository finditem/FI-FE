const VAPID_PUBLIC_KEY_FIELD_CANDIDATES = [
  "publicKey",
  "public_key",
  "vapidPublicKey",
  "applicationServerKey",
] as const;

export function pickVapidPublicKey(result: Record<string, string>): string {
  for (const key of VAPID_PUBLIC_KEY_FIELD_CANDIDATES) {
    const value = result[key];
    if (value && value.length > 0) return value;
  }

  const values = Object.values(result).filter((v) => typeof v === "string" && v.length >= 80);
  if (values.length > 0) return values[0];

  throw new Error("VAPID public key not found in response");
}
