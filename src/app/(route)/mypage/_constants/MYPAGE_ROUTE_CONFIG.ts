export const MYPAGE_MENU_LIST = [
  {
    title: "내 활동",
    pages: [
      { pageName: "내가 쓴 게시글", pageLink: "/mypage/posts" },
      { pageName: "내가 쓴 댓글", pageLink: "/mypage/comments" },
      { pageName: "즐겨찾기 목록", pageLink: "/mypage/favorites" },
      { pageName: "내 활동 내역", pageLink: "/mypage/activities" },
      { pageName: "내가 차단한 계정", pageLink: "/mypage/blocked-users" },
    ],
  },
  {
    title: "알림",
    pages: [{ pageName: "알림 설정", pageLink: "/mypage/notifications" }],
  },
  {
    title: "신고/문의",
    pages: [
      { pageName: "내 신고 내역", pageLink: "/mypage/reports" },
      { pageName: "내 문의 내역", pageLink: "/mypage/inquiries" },
      { pageName: "자주 묻는 질문", pageLink: "/support" },
    ],
  },
  {
    title: "계정 관리",
    pages: [{ pageName: "계정 설정", pageLink: "/mypage/account" }],
  },
  {
    title: "서비스 정책",
    pages: [
      { pageName: "서비스 소개", pageLink: "/hello" },
      { pageName: "개인정보처리방침", pageLink: "/terms/privacy" },
      { pageName: "서비스 이용 약관", pageLink: "/terms/service" },
      { pageName: "마케팅 수신 약관", pageLink: "/terms/marketing" },
      { pageName: "콘텐츠 활용 동의서", pageLink: "/terms/contentPolicy" },
    ],
  },
] as const;

export const MYPAGE_TAP_CONFIG = [
  { pageName: "공지사항", iconName: "AnnotationAlert", pageLink: "/notice" },
  { pageName: "채팅목록", iconName: "MessageTyping", pageLink: "/chat" },
] as const;
