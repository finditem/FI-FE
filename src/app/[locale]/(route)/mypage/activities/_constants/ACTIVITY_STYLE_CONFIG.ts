export const ACTIVITY_STYLE_CONFIG = {
  POST: { bgColor: "bg-notificationBlue", iconName: "Post", logTitleKey: "postCreated" },
  COMMENT: {
    bgColor: "bg-notificationGrey",
    iconName: "Comment",
    logTitleKey: "commentCreated",
  },
  FAVORITE: {
    bgColor: "bg-notificationYellow",
    iconName: "EmptyStar",
    logTitleKey: "favoriteAdded",
  },
  INQUIRY: {
    bgColor: "bg-notificationGrey",
    iconName: "Inquiry",
    logTitleKey: "inquiryCreated",
  },
  INQUIRY_RECEIVED: {
    bgColor: "bg-notificationGrey",
    iconName: "Inquiry",
    logTitleKey: "inquiryCreated",
  },
  INQUIRY_ANSWERED: {
    bgColor: "bg-notificationBrand",
    iconName: "InquiryAnswered",
    logTitleKey: "inquiryAnswered",
  },
  REPORT: {
    bgColor: "bg-notificationGrey",
    iconName: "Report",
    logTitleKey: "reportReceived",
  },
  REPORT_RECEIVED: {
    bgColor: "bg-notificationGrey",
    iconName: "Report",
    logTitleKey: "reportReceived",
  },
  REPORT_ANSWERED: {
    bgColor: "bg-notificationBrand",
    iconName: "Report",
    logTitleKey: "reportAnswered",
  },
} as const;
