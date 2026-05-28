import { IconName } from "@/components";
import { InfoButtonOptionValue } from "../_types/InfoButtonOptionValue";

export const CHAT_CHIP_MODE = {
  FIND: { style: "text-accent-foundItem bg-fill-accent-foundItem", text: "발견" },
  LOST: { style: "text-accent-lostItem bg-fill-accent-lostItem", text: "분실" },
  FOUND_STATUS: {
    style: "bg-toast/70 text-white px-1 py-[2.5px]",
    text: "찾았어요",
  },
} as const;

export type ChatChipMode = keyof typeof CHAT_CHIP_MODE;

interface InfoOption {
  label: string;
  value: InfoButtonOptionValue;
  textColor: "text-neutral-normal-default" | "text-system-warning";
  position: "first" | "last";
}

export const INFO_OPTIONS: InfoOption[] = [
  {
    label: "차단, 신고하기",
    value: "report",
    textColor: "text-neutral-normal-default",
    position: "first",
  },
  {
    label: "채팅방 나가기",
    value: "leave",
    textColor: "text-system-warning",
    position: "last",
  },
];

export const CHAT_SENDER_STYLE = {
  me: {
    container: "justify-end",
    timeOrder: "order-1",
    bubbleOrder: "order-2",
    bubbleColor:
      "bg-fill-brand-normal-default bg-opacity-70 text-brand-subtle-default rounded-br-[0px]",
  },
  other: {
    container: "justify-start",
    timeOrder: "order-2",
    bubbleOrder: "order-1",
    bubbleColor: "bg-white text-layout-header-default rounded-bl-[0px]",
  },
};

export const EMPTY_MODE_STYLE = {
  lost: {
    iconName: "ChatLost" as IconName,
    helpText: ["이 분실물을 주우셨나요?", "주인에게 먼저 연락해보세요."],
  },
  find: {
    iconName: "ChatFind" as IconName,
    helpText: ["내 물건이 맞는지 확인해보세요.", "발견자에게 메시지를 보내세요."],
  },
};
