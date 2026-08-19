export const MYPAGE_MENU_LIST = [
  {
    key: "myActivity",
    pages: [
      { key: "myPosts", pageLink: "/mypage/posts" },
      { key: "myComments", pageLink: "/mypage/comments" },
      { key: "favorites", pageLink: "/mypage/favorites" },
      { key: "myActivities", pageLink: "/mypage/activities" },
      { key: "blockedUsers", pageLink: "/mypage/blocked-users" },
    ],
  },
  {
    key: "notification",
    pages: [{ key: "notificationSettings", pageLink: "/mypage/notifications" }],
  },
  {
    key: "reportInquiry",
    pages: [
      { key: "myReports", pageLink: "/mypage/reports" },
      { key: "myInquiries", pageLink: "/mypage/inquiries" },
      { key: "faq", pageLink: "/support" },
    ],
  },
  {
    key: "accountManagement",
    pages: [{ key: "accountSettings", pageLink: "/mypage/account" }],
  },
  {
    key: "servicePolicy",
    pages: [
      { key: "serviceIntro", pageLink: "/hello" },
      { key: "privacyPolicy", pageLink: "/terms/privacy" },
      { key: "serviceTerms", pageLink: "/terms/service" },
      { key: "marketingTerms", pageLink: "/terms/marketing" },
      { key: "contentPolicy", pageLink: "/terms/contentPolicy" },
    ],
  },
] as const;

export const MYPAGE_TAP_CONFIG = [
  { key: "notice", iconName: "AnnotationAlert", pageLink: "/notice" },
  { key: "chatList", iconName: "MessageTyping", pageLink: "/chat" },
] as const;
