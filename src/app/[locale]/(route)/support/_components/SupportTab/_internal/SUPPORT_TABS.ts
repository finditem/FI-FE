export const SUPPORT_TAB_KEYS = ["all", "account", "usage", "etc"] as const;
export type SupportTabKey = (typeof SUPPORT_TAB_KEYS)[number];
