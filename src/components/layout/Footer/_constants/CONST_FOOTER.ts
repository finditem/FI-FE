export const FOOTER_LINK = [
  { labelKey: "home", href: "/", icon: "Home", requiresLogin: false },
  { labelKey: "list", href: "/list", icon: "Luggage", requiresLogin: false },
  {
    labelKey: "chat",
    href: "/chat",
    icon: "Chat",
    alert: "top-[5px] right-[-4px]",
    requiresLogin: true,
  },
  {
    labelKey: "alert",
    href: "/alert",
    icon: "AlertBellFooter",
    alert: "top-[6px] right-[0.3px]",
    requiresLogin: true,
  },
  {
    labelKey: "mypage",
    href: "/mypage",
    adminHref: "/admin",
    icon: "UserProfileHome",
    requiresLogin: false,
  },
] as const;

export type FooterLinkHref = (typeof FOOTER_LINK)[number]["href"];

export const FOOTER_ITEM_BASE_STYLE = "group min-w-0 flex-1 transition-colors flex-col-center";
