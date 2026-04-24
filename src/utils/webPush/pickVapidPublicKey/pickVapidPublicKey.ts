import { VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC } from "@/constants";

const VAPID_PUBLIC_KEY_FIELD_CANDIDATES = [
  "publicKey",
  "public_key",
  "vapidPublicKey",
  "applicationServerKey",
] as const;

/**
 * VAPID 공개키 API 응답 객체에서 공개키 문자열 하나를 고릅니다.
 *
 * @param result - 키-값이 모두 문자열인 응답 본문
 * @returns URL-safe Base64 형태의 공개키 문자열
 * @throws 키를 찾지 못하면 `Error`
 *
 * @remarks
 * - 알려진 필드명(`publicKey`, `public_key` 등)을 순서대로 봅니다.
 * - 없으면 값 중 길이가 {@link VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC} 이상인 첫 문자열을 씁니다.
 *
 * @example
 * ```ts
 * const { data } = await publicApi.get("/push/vapid-key");
 * if (data.isSuccess && data.result) {
 *   const publicKeyB64 = pickVapidPublicKey(data.result);
 * }
 * ```
 *
 * @author hyungjun
 */

export const pickVapidPublicKey = (result: Record<string, string>): string => {
  for (const key of VAPID_PUBLIC_KEY_FIELD_CANDIDATES) {
    const value = result[key];
    if (value && value.length > 0) return value;
  }

  const values = Object.values(result).filter(
    (v) => typeof v === "string" && v.length >= VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC
  );
  if (values.length > 0) return values[0];

  throw new Error("VAPID public key not found in response");
};
