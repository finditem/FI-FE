import type { NotificationListItem } from "@/api/fetch/notification";
import { NOTIFICATION_TYPE, REFERENCE_TYPE } from "@/api/fetch/notification";

export const MOCK_ALERT_NOTIFICATION_ITEM: NotificationListItem = {
  notificationId: 1,
  type: NOTIFICATION_TYPE.CHAT,
  title: "채팅 알림",
  message: "새 메시지가 도착했습니다.",
  referenceType: REFERENCE_TYPE.CHAT,
  referenceId: 1,
  isRead: false,
  createdAt: "2026-01-15T10:00:00.000Z",
  roomId: 1,
};
