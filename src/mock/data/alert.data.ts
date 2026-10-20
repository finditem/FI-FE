import type { NotificationListItem, NotificationListResponse } from "@/api/fetch/notification";
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

/** 후기 도착 알림. 백엔드 NotificationType enum에 REVIEW가 아직 없어(2026-10-19 기준) FE 퍼블리싱용으로만 사용 */
export const MOCK_ALERT_NOTIFICATION_REVIEW_ITEM: NotificationListItem = {
  notificationId: 2,
  type: NOTIFICATION_TYPE.REVIEW,
  title: "새로운 후기가 도착했어요.",
  message: "서울시 노원구 00동 건물 화장실에서 핸드폰을 잃어버...",
  referenceType: REFERENCE_TYPE.POST,
  referenceId: 1,
  isRead: false,
  createdAt: "2026-01-15T10:00:00.000Z",
  roomId: 0,
};

export const MOCK_ALERT_NOTIFICATION_LIST_RESPONSE: NotificationListResponse = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    content: [MOCK_ALERT_NOTIFICATION_ITEM],
    nextCursor: 0,
    hasNext: false,
  },
};

export const MOCK_ALERT_NOTIFICATION_LIST_WITH_REVIEW_RESPONSE: NotificationListResponse = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    content: [MOCK_ALERT_NOTIFICATION_REVIEW_ITEM, MOCK_ALERT_NOTIFICATION_ITEM],
    nextCursor: 0,
    hasNext: false,
  },
};

export const MOCK_ALERT_NOTIFICATION_EMPTY_LIST_RESPONSE: NotificationListResponse = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    content: [],
    nextCursor: 0,
    hasNext: false,
  },
};
