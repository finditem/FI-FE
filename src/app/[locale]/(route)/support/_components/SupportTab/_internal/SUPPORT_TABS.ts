export const SUPPORT_TAB_KEYS = ["all", "account", "usage", "etc"] as const;
export type SupportTabKey = (typeof SUPPORT_TAB_KEYS)[number];

export const SUPPORT_TABS: ReadonlyArray<{ key: SupportTabKey; label: string }> = [
  { key: "all", label: "전체" },
  { key: "account", label: "계정" },
  { key: "usage", label: "이용 방법" },
  { key: "etc", label: "기타" },
];
