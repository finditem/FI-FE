import { IconName } from "@/components";
import { InfoButtonOptionValue } from "../_types/InfoButtonOptionValue";

export const CHAT_CHIP_MODE = {
  FIND: { style: "text-accent-foundItem bg-fill-accent-foundItem" },
  LOST: { style: "text-accent-lostItem bg-fill-accent-lostItem" },
  FOUND_STATUS: {
    style: "bg-toast/70 text-white px-1 py-[2.5px]",
  },
} as const;

export type ChatChipMode = keyof typeof CHAT_CHIP_MODE;

interface InfoOption {
  value: InfoButtonOptionValue;
  textColor: "text-neutral-normal-default" | "text-system-warning";
  position: "first" | "last";
}

export const INFO_OPTIONS: InfoOption[] = [
  {
    value: "report",
    textColor: "text-neutral-normal-default",
    position: "first",
  },
  {
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
  },
  find: {
    iconName: "ChatFind" as IconName,
  },
};
