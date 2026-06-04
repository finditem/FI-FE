/**
 * 서버 알림 설정과 브라우저 알림 권한이 모두 켜진 상태인지 반환합니다.
 */
export const isBrowserNotificationEffectivelyEnabled = (
  apiEnabled: boolean,
  notificationPermission?: NotificationPermission
): boolean => apiEnabled && notificationPermission === "granted";
