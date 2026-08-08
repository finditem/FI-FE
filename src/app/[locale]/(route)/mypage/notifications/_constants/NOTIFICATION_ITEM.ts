import { NotificationLabelType, NotificationSettingType } from "../_types/NotificationType";

export const NOTIFICATION_CONFIG: {
  label: NotificationLabelType;
  value: NotificationSettingType;
}[] = [
  { label: "카테고리 키워드", value: "categoryEnabled" },
  { label: "카테고리 키워드 선택", value: "enabledCategories" },
  { label: "채팅", value: "chatEnabled" },
  { label: "댓글", value: "commentEnabled" },
  { label: "즐겨찾기", value: "favoriteEnabled" },
  { label: "1:1 문의", value: "inquiryReplyEnabled" },
  { label: "신고", value: "reportResultEnabled" },
  { label: "공지사항", value: "noticeEnabled" },
];

export const NOTIFICATION = {
  commentEnabled: { label: "댓글" },
  chatEnabled: { label: "채팅" },
  inquiryReplyEnabled: { label: "1:1 문의" },
  reportResultEnabled: { label: "신고" },
  favoriteEnabled: { label: "즐겨찾기" },
  noticeEnabled: { label: "공지사항" },
  categoryEnabled: { label: "카테고리 키워드" },
  enabledCategories: { label: "카테고리 키워드 선택" },
};
