export const PHONE = {
  src: "/hello/third/service-third-phone-layout.webp",
  width: 200,
  height: 270,
} as const;

export const SIDE_MESSAGES = [
  {
    src: "/hello/third/service-third-message-left.svg",
    width: 50,
    height: 50,
    className: "absolute bottom-[16px] left-[-42px]",
  },
  {
    src: "/hello/third/service-third-message-right.svg",
    width: 56,
    height: 56,
    className: "absolute right-[-40px] top-[100px]",
  },
] as const;

export const CHAT_ITEMS = [
  {
    src: "/hello/third/service-third-item-01.svg",
    width: 50,
    height: 50,
    className: "self-center",
  },
  {
    src: "/hello/third/service-third-item-02.svg",
    width: 145,
    height: 38,
    className: "mt-[7px] self-end",
  },
] as const;

export const CHAT_STACK_LEFT = [
  { src: "/hello/third/service-third-item-03.svg", width: 126, height: 20 },
  { src: "/hello/third/service-third-item-04.svg", width: 126, height: 38 },
  { src: "/hello/third/service-third-item-05.svg", width: 126, height: 20 },
] as const;

export const CHAT_LAST = {
  src: "/hello/third/service-third-item-06.svg",
  width: 145,
  height: 38,
  className: "mt-[7px] self-end",
};
