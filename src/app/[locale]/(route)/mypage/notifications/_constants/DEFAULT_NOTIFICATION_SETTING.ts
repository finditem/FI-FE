import { NotificationSetting } from "@/api/fetch/notification";

export const DEFAULT_NOTIFICATION_SETTING: NotificationSetting = {
  commentEnabled: false,
  chatEnabled: false,
  inquiryReplyEnabled: false,
  reportResultEnabled: false,
  favoriteEnabled: false,
  noticeEnabled: false,
  categoryEnabled: false,
  enabledCategories: [],
  browserNotificationEnabled: false,
  marketingConsent: false,
  contentPolicyAgreed: false,
  termsOfServiceAgreed: false,
};
