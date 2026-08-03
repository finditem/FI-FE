export const USER_TABS = [
  { key: "posts", label: "게시글" },
  { key: "comments", label: "댓글" },
  { key: "favorites", label: "즐겨찾기" },
] as const;

export type UserProfileTabKey = (typeof USER_TABS)[number]["key"];
