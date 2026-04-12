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
