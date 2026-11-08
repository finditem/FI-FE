import type { SupportTabKey } from "../../SupportTab/_internal/SUPPORT_TABS";

interface FaqAnswerLinkSegment {
  href: string;
}

export interface FaqItem {
  id: number;
  category: SupportTabKey;
  link?: FaqAnswerLinkSegment;
}

export const FAQ_ITEMS: FaqItem[] = [
  // ========== 전체 ==========
  { id: 1, category: "all" },
  { id: 2, category: "all", link: { href: "/list" } },
  { id: 3, category: "all" },
  { id: 4, category: "all" },
  { id: 5, category: "all" },
  { id: 6, category: "all" },
  // ========== 계정 ==========
  { id: 7, category: "account", link: { href: "/sign-up" } },
  { id: 8, category: "account" },
  { id: 9, category: "account", link: { href: "/login" } },
  { id: 10, category: "account", link: { href: "/login" } },
  { id: 11, category: "account" },
  { id: 12, category: "account" },
  { id: 13, category: "account" },
  // ========== 이용 방법 ==========
  { id: 14, category: "usage", link: { href: "/write/post?type=lost" } },
  { id: 15, category: "usage" },
  { id: 16, category: "usage" },
  { id: 17, category: "usage" },
  { id: 18, category: "usage" },
  { id: 19, category: "usage" },
  { id: 20, category: "usage" },
  { id: 21, category: "usage" },
  { id: 22, category: "usage" },
  // ========== 기타 ==========
  { id: 23, category: "etc" },
  { id: 24, category: "etc" },
  { id: 25, category: "etc" },
  { id: 26, category: "etc" },
  { id: 27, category: "etc" },
  { id: 28, category: "etc", link: { href: "/notice" } },
  { id: 29, category: "etc", link: { href: "/mypage/blocked-users" } },
];
