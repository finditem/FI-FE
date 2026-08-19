import { NotificationLabelType, NotificationSettingType } from "../_types/NotificationType";

export const NOTIFICATION_CONFIG: {
  labelKey: NotificationLabelType;
  value: NotificationSettingType;
}[] = [
  { labelKey: "categoryKeywords", value: "categoryEnabled" },
  { labelKey: "selectCategoryKeywords", value: "enabledCategories" },
  { labelKey: "chat", value: "chatEnabled" },
  { labelKey: "comments", value: "commentEnabled" },
  { labelKey: "favorites", value: "favoriteEnabled" },
  { labelKey: "inquiries", value: "inquiryReplyEnabled" },
  { labelKey: "reports", value: "reportResultEnabled" },
  { labelKey: "notices", value: "noticeEnabled" },
];
