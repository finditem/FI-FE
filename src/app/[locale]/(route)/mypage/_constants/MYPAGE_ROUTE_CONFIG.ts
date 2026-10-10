export const MYPAGE_MENU_LIST = [
  {
    key: "myActivity",
    pages: [
      { key: "myPosts", iconName: "MypagePosts", pageLink: "/mypage/posts" },
      { key: "myComments", iconName: "MypageComments", pageLink: "/mypage/comments" },
      { key: "favorites", iconName: "MypageFavorites", pageLink: "/mypage/favorites" },
      { key: "myActivities", iconName: "MypageActivities", pageLink: "/mypage/activities" },
      { key: "blockedUsers", iconName: "MypageBlockedUsers", pageLink: "/mypage/blocked-users" },
    ],
  },
  {
    key: "notification",
    pages: [
      {
        key: "notificationSettings",
        iconName: "MypageNotificationSettings",
        pageLink: "/mypage/notifications",
      },
    ],
  },
  {
    key: "reportInquiry",
    pages: [
      { key: "myReports", iconName: "MypageReports", pageLink: "/mypage/reports" },
      { key: "myInquiries", iconName: "MypageInquiries", pageLink: "/mypage/inquiries" },
      { key: "faq", iconName: "MypageFaq", pageLink: "/support" },
    ],
  },
  {
    key: "accountManagement",
    pages: [
      { key: "languageSettings", iconName: "MypageLanguageSettings", pageLink: "/mypage/language" },
      { key: "accountSettings", iconName: "MypageAccountSettings", pageLink: "/mypage/account" },
    ],
  },
  {
    key: "servicePolicy",
    pages: [
      { key: "notice", iconName: "MypageNotice", pageLink: "/notice" },
      { key: "serviceIntro", iconName: "MypageServiceIntro", pageLink: "/hello" },
      { key: "privacyPolicy", iconName: "MypagePrivacyPolicy", pageLink: "/terms/privacy" },
      { key: "serviceTerms", iconName: "MypageServiceTerms", pageLink: "/terms/service" },
      { key: "marketingTerms", iconName: "MypageMarketingTerms", pageLink: "/terms/marketing" },
      { key: "contentPolicy", iconName: "MypageContentPolicy", pageLink: "/terms/contentPolicy" },
    ],
  },
] as const;

export const MYPAGE_TAP_CONFIG = [
  // TODO(준열): 찾길 후기 화면 경로가 확정되면 pageLink를 교체한다.
  { key: "review", iconName: "MypageReview", pageLink: "/mypage/reviews" },
  { key: "favoritePlaces", iconName: "MypageFavoritePlaces", pageLink: "/mypage/favorite-places" },
  { key: "chatList", iconName: "MypageChatList", pageLink: "/chat" },
] as const;
