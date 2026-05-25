export const BUTTON_DEFAULT_STYLE =
  "block w-full rounded-2xl py-7 pl-[30px] text-h2-bold relative overflow-hidden text-layout-header-default";

export const WRITE_BUTTONS = [
  {
    label: "분실한 물건 등록하기",
    href: "/write/post?type=lost",
    icon: "/main/LostFindActions/lost-position.svg",
    style: "bg-fill-accent-lostItem2",
  },
  {
    label: "발견한 물건 등록하기",
    href: "/write/post?type=find",
    icon: "/main/LostFindActions/found-position.svg",
    style: "bg-fill-brand-subtle-hover",
  },
];
