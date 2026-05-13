export const BUTTON_DEFAULT_STYLE =
  "block w-full rounded-2xl py-7 pl-[30px] text-h2-bold relative overflow-hidden";

export const WRITE_BUTTONS = [
  {
    label: "분실한 물건 등록하기",
    href: "/write/post?type=lost",
    icon: "/main/LostFindActions/lost-position.svg",
    style: "text-[#5B3322] bg-fill-accent-lostItem2",
  },
  {
    label: "발견한 물건 등록하기",
    href: "/write/post?type=find",
    icon: "/main/LostFindActions/found-position.svg",
    style: "text-[#173C28] bg-fill-brand-subtle-hover",
  },
];
