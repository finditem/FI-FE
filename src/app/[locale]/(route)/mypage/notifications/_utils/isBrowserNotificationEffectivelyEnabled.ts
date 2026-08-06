/**
 * 서버 알림 설정과 브라우저 알림 권한이 모두 켜진 상태인지 반환합니다.
 *
 * @param apiEnabled - 서버(알림 설정 API)에서 브라우저 알림이 켜져 있는지 여부
 * @param notificationPermission - `Notification.permission` 값 (`undefined`면 미지원·SSR)
 *
 * @returns `apiEnabled`가 `true`이고 권한이 `granted`일 때만 `true`
 *
 * @remarks
 * - 서버 설정만 켜져 있거나 브라우저 권한만 허용된 경우에는 `false`입니다.
 * - 알림 설정 토글 UI에서 실제로 알림을 받을 수 있는지 판별할 때 사용합니다.
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * isBrowserNotificationEffectivelyEnabled(true, "granted");  // true
 * isBrowserNotificationEffectivelyEnabled(true, "denied");   // false
 * isBrowserNotificationEffectivelyEnabled(false, "granted"); // false
 * ```
 */

export const isBrowserNotificationEffectivelyEnabled = (
  apiEnabled: boolean,
  notificationPermission?: NotificationPermission
): boolean => apiEnabled && notificationPermission === "granted";
