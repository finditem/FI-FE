import type { IconName } from "@/components";

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
