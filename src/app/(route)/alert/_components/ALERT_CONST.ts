export const ALERT_CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "category", label: "카테고리 키워드" },
  { key: "chat", label: "채팅" },
  { key: "comment", label: "댓글" },
  { key: "notice", label: "공지사항" },
  { key: "inquiry_reply", label: "문의" },
  { key: "report_result", label: "신고" },
] as const;

export const ALERT_ROW_BG = {
  read: {
    default: "bg-white hover:bg-fill-flatGray-25",
    delete: "bg-white hover:bg-white",
  },
  unread: {
    default: "bg-fill-brand-subtle-default_3 hover:bg-fill-brand-subtle-default_2",
    delete: "bg-fill-brand-subtle-default_3 hover:bg-fill-brand-subtle-default_3",
  },
} as const;

import { NotificationType, ReferenceType } from "@/api/fetch/notification";

type AlertIconBackgroundColor = {
  icon: string;
  bg: string;
};

/**
 * 알림 종류(NotificationType) 우선 매핑
 */
export const ALERT_ICON_BG_BY_NOTIFICATION_TYPE: Partial<
  Record<NotificationType, AlertIconBackgroundColor>
> = {
  FAVORITE: { icon: "AlertStar", bg: "bg-system-bookmark" },
  CATEGORY: { icon: "AlertItem", bg: "bg-fg-accent-foundItem" },
  COMMENT: { icon: "Comment", bg: "bg-fg-neutral-strong-default" },
};

export const DEFAULT_ALERT_ICON_BG: AlertIconBackgroundColor = {
  icon: "AlertItem",
  bg: "bg-fg-accent-foundItem",
};

/**
 * 참조(ReferenceType) 매핑 — 타입별 매핑이 없을 때 사용
 */
export const ALERT_ICON_BG_BY_REFERENCE_TYPE: Partial<
  Record<
    ReferenceType,
    AlertIconBackgroundColor | ((type: NotificationType) => AlertIconBackgroundColor)
  >
> = {
  POST: DEFAULT_ALERT_ICON_BG,
  COMMENT: { icon: "Comment", bg: "bg-fg-neutral-strong-default" },
  CHAT: (type) => {
    const icon = type === "CHAT_REMINDER" ? "AlertUnreadChat" : "AlertNewChat";
    return { icon, bg: "bg-fg-brand-normal-default" };
  },
  INQUIRY: { icon: "AlertInquiry", bg: "bg-fg-neutral-strong-default" },
  NOTICE: { icon: "AlertNotice", bg: "bg-system-announcement" },
  REPORT: { icon: "AlertInquiry", bg: "bg-system-report" },
};
