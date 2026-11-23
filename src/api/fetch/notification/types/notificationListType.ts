import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { NotificationType, ReferenceType } from "./notificationSSETypes";

export interface NotificationListItem {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: ReferenceType;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
  roomId: number;
}

export interface NotificationListCursorPageResponse {
  content: NotificationListItem[];
  nextCursor: number;
  hasNext: boolean;
}

export type NotificationListResponse = ApiBaseResponseType<NotificationListCursorPageResponse>;

/** 안 읽은 알림 조회 결과 */
export interface NotificationUnreadListResult {
  /** 첫 페이지의 안 읽은 알림 */
  items: NotificationListItem[];
  /** 첫 페이지 밖에 안 읽은 알림이 더 있는지 여부 */
  hasNext: boolean;
}
