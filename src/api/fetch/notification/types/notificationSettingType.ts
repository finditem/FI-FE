import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { CategoryType } from "@/types";

export interface GetNotificationSetting extends ApiBaseResponseType<NotificationSetting> {}

export interface PutNotificationSetting extends ApiBaseResponseType<NotificationSetting> {}

export interface NotificationSetting {
  commentEnabled: boolean;
  chatEnabled: boolean;
  inquiryReplyEnabled: boolean;
  reportResultEnabled: boolean;
  favoriteEnabled: boolean;
  noticeEnabled: boolean;
  categoryEnabled: boolean;
  enabledCategories: CategoryType[];
  browserNotificationEnabled: boolean;
  marketingConsent: boolean;
  contentPolicyAgreed: boolean;
  termsOfServiceAgreed: boolean;
}

export interface notificationSettingRequest {
  commentEnabled?: boolean;
  chatEnabled?: boolean;
  inquiryReplyEnabled?: boolean;
  reportResultEnabled?: boolean;
  favoriteEnabled?: boolean;
  noticeEnabled?: boolean;
  categoryEnabled?: boolean;
  enabledCategories?: CategoryType[];
  browserNotificationEnabled?: boolean;
  marketingConsent?: boolean;
  contentPolicyAgreed?: boolean;
  termsOfServiceAgreed?: boolean;
}
