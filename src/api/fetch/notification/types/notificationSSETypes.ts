/**
 * FMI 알림 SSE 스펙 기반 타입 정의
 */

/** 알림 타입 */
export const NOTIFICATION_TYPE = {
  COMMENT: "COMMENT",
  CHAT: "CHAT",
  CHAT_REMINDER: "CHAT_REMINDER",
  INQUIRY_REPLY: "INQUIRY_REPLY",
  REPORT_RESULT: "REPORT_RESULT",
  FAVORITE: "FAVORITE",
  CATEGORY: "CATEGORY",
  NOTICE: "NOTICE",
  SYSTEM: "SYSTEM",
  REVIEW: "REVIEW",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/** 참조 타입 */
export const REFERENCE_TYPE = {
  POST: "POST",
  COMMENT: "COMMENT",
  CHAT: "CHAT",
  INQUIRY: "INQUIRY",
  NOTICE: "NOTICE",
  REPORT: "REPORT",
  REVIEW: "REVIEW",
} as const;

export type ReferenceType = (typeof REFERENCE_TYPE)[keyof typeof REFERENCE_TYPE];

/** SSE notification 이벤트 데이터 */
export interface NotificationEventData {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: ReferenceType;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
}
