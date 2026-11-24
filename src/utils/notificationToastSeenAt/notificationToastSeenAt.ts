const NOTIFICATION_TOAST_SEEN_AT_KEY = "notification-toast-seen-at";

/**
 * 마지막으로 토스트에 보여 준 알림의 생성 시각(ms)을 읽습니다.
 *
 * @remarks
 * - 새로고침·새 탭에서 같은 알림으로 토스트를 반복하지 않으려고 씁니다.
 * - 저장소에 접근할 수 없거나 값이 없으면 `null`을 반환합니다. 이때는 토스트를 띄우는 쪽으로 처리합니다.
 *
 * @author suhyeon
 *
 * @example
 * const seenAt = getNotificationToastSeenAt();
 */
export const getNotificationToastSeenAt = (): number | null => {
  try {
    const stored = Number(localStorage.getItem(NOTIFICATION_TOAST_SEEN_AT_KEY));
    return stored > 0 ? stored : null;
  } catch {
    return null;
  }
};

/**
 * 토스트에 보여 준 알림의 생성 시각을 저장합니다. 저장된 값보다 이전 시각이면 무시합니다.
 *
 * @remarks 채팅 알림은 같은 번호로 생성 시각만 바뀌어 다시 오므로, 번호가 아니라 생성 시각을 기준으로 저장합니다.
 *
 * @param createdAt - 서버가 내려준 알림 생성 시각
 *
 * @author suhyeon
 *
 * @example
 * saveNotificationToastSeenAt(notification.createdAt);
 */
export const saveNotificationToastSeenAt = (createdAt: string) => {
  const time = Date.parse(createdAt);
  if (Number.isNaN(time)) return;
  if (time <= (getNotificationToastSeenAt() ?? 0)) return;

  try {
    localStorage.setItem(NOTIFICATION_TOAST_SEEN_AT_KEY, String(time));
  } catch {
    // 저장에 실패하면 다음 진입 때 토스트가 한 번 더 뜰 뿐이라 무시한다.
  }
};

/**
 * 저장된 토스트 확인 시각을 지웁니다. 다른 계정에 이전 기록이 남지 않도록 세션 종료 시 호출합니다.
 *
 * @author suhyeon
 *
 * @example
 * clearNotificationToastSeenAt();
 */
export const clearNotificationToastSeenAt = () => {
  try {
    localStorage.removeItem(NOTIFICATION_TOAST_SEEN_AT_KEY);
  } catch {
    // 저장소에 접근할 수 없으면 지울 값도 없다.
  }
};
