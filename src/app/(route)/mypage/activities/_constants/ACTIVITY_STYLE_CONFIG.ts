export const ACTIVITY_STYLE_CONFIG = {
  POST: { bgColor: "bg-notificationBlue", iconName: "Post", logTitle: "게시글을 작성했어요." },
  COMMENT: {
    bgColor: "bg-notificationGrey",
    iconName: "Comment",
    logTitle: "댓글을 작성했어요.",
  },
  FAVORITE: {
    bgColor: "bg-notificationYellow",
    iconName: "EmptyStar",
    logTitle: "게시글을 즐겨찾기했어요.",
  },
  // TODO(수현): 디자인, 백엔드 api 업데이트 확인 필요함
  INQUIRY: {
    bgColor: "bg-notificationGrey",
    iconName: "Inquiry",
    logTitle: "1:1문의를 작성했어요.",
  },
  INQUIRY_RECEIVED: {
    bgColor: "bg-notificationGrey",
    iconName: "Inquiry",
    logTitle: "1:1문의를 작성했어요.",
  },
  INQUIRY_ANSWERED: {
    bgColor: "bg-notificationBrand",
    iconName: "InquiryAnswered",
    logTitle: "1:1 문의에 대한 답변이 등록되었어요.",
  },
  REPORT: {
    bgColor: "bg-notificationGrey",
    iconName: "Report",
    logTitle: "신고가 접수되었어요.",
  },
  REPORT_RECEIVED: {
    bgColor: "bg-notificationGrey",
    iconName: "Report",
    logTitle: "신고가 접수되었어요.",
  },
  REPORT_ANSWERED: {
    bgColor: "bg-notificationBrand",
    iconName: "Report",
    logTitle: "신고에 대한 답변이 등록되었어요.",
  },
} as const;
