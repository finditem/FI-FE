import { NotificationType, ReferenceType } from "@/api/fetch/notification";
import {
  ALERT_ICON_BG_BY_NOTIFICATION_TYPE,
  ALERT_ICON_BG_BY_REFERENCE_TYPE,
  DEFAULT_ALERT_ICON_BG,
} from "../_components/ALERT_CONST";

export const getAlertIconBackgroundColor = (
  type: NotificationType,
  referenceType: ReferenceType
) => {
  if (type === "FAVORITE" || type === "CATEGORY") {
    const byType = ALERT_ICON_BG_BY_NOTIFICATION_TYPE[type];
    if (byType) return byType;
  }

  if (referenceType === "INQUIRY" || referenceType === "REPORT") {
    const fixed = ALERT_ICON_BG_BY_REFERENCE_TYPE[referenceType];
    if (fixed && typeof fixed !== "function") return fixed;
  }

  if (referenceType === "CHAT") {
    const chatMapper = ALERT_ICON_BG_BY_REFERENCE_TYPE.CHAT;
    if (chatMapper) {
      return typeof chatMapper === "function" ? chatMapper(type) : chatMapper;
    }
  }

  if (type === "COMMENT") {
    const commentByType = ALERT_ICON_BG_BY_NOTIFICATION_TYPE.COMMENT;
    if (commentByType) return commentByType;
  }

  const refMapper = ALERT_ICON_BG_BY_REFERENCE_TYPE[referenceType];
  if (refMapper) {
    return typeof refMapper === "function" ? refMapper(type) : refMapper;
  }

  const byType = ALERT_ICON_BG_BY_NOTIFICATION_TYPE[type];
  if (byType) return byType;

  return DEFAULT_ALERT_ICON_BG;
};
