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
    pages: [
      { key: "languageSettings", pageLink: "/mypage/language" },
      { key: "accountSettings", pageLink: "/mypage/account" },
    ],
  },
  {
    key: "servicePolicy",
    pages: [
      { key: "notice", pageLink: "/notice" },
      { key: "serviceIntro", pageLink: "/hello" },
      { key: "privacyPolicy", pageLink: "/terms/privacy" },
      { key: "serviceTerms", pageLink: "/terms/service" },
      { key: "marketingTerms", pageLink: "/terms/marketing" },
      { key: "contentPolicy", pageLink: "/terms/contentPolicy" },
    ],
  },
] as const;

export const MYPAGE_TAP_CONFIG = [
  // TODO(준열): 찾길 후기 화면 경로가 확정되면 pageLink를 교체한다.
  { key: "review", iconName: "MypageReview", pageLink: "/mypage/reviews" },
  // TODO(준열): 찜한 장소 목록 화면 경로가 확정되면 pageLink를 교체한다.
  { key: "favoritePlaces", iconName: "MypageFavoritePlaces", pageLink: "/mypage/favorite-places" },
  { key: "chatList", iconName: "MypageChatList", pageLink: "/chat" },
] as const;
