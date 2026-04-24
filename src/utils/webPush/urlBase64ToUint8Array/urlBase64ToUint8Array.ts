/**
 * URL-safe Base64(VAPID 키 등) 문자열을 `Uint8Array`로 디코딩합니다.
 *
 * `PushManager.subscribe`의 `applicationServerKey`에 넘기기 전 변환에 사용합니다.
 *
 * @param base64String - 패딩 없이 `-`/`_`를 쓰는 형태를 포함한 Base64 문자열
 * @returns 디코딩된 바이트 배열
 *
 * @remarks
 * - 표준 Base64로 정규화한 뒤 `atob`로 이진 문자열을 만든 다음 바이트 배열로 복사합니다.
 *
 * @example
 * ```ts
 * const applicationServerKey = urlBase64ToUint8Array(vapidPublicKeyFromApi);
 * await registration.pushManager.subscribe({
 *   userVisibleOnly: true,
 *   applicationServerKey,
 * });
 * ```
 *
 * @author hyungjun
 */

export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
};
