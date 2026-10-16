import { IconName } from "@/components";
import { InfoButtonOptionValue } from "../_types/InfoButtonOptionValue";

export const CHAT_CHIP_MODE = {
  FIND: { style: "text-accent-foundItem bg-fill-accent-foundItem" },
  LOST: { style: "text-accent-lostItem bg-fill-accent-lostBtn" },
  FOUND_STATUS: {
    style: "bg-toast/70 text-white px-1 py-[2.5px]",
  },
} as const;

export type ChatChipMode = keyof typeof CHAT_CHIP_MODE;

interface InfoOption {
  value: InfoButtonOptionValue;
  textColor: "text-system-warning" | "text-brand-strongUseThis-default";
  icon: IconName;
}

export const getInfoOptions = (canMarkFound: boolean): InfoOption[] => {
  const options: InfoOption[] = [];

  if (canMarkFound) {
    options.push({
      value: "changeToFound",
      textColor: "text-brand-strongUseThis-default",
      icon: "CheckBroken",
    });
  }
  options.push({
    value: "reportBlock",
    textColor: "text-system-warning",
    icon: "ChatReport",
  });
  options.push({ value: "leave", textColor: "text-system-warning", icon: "Logout" });

  return options;
};

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
