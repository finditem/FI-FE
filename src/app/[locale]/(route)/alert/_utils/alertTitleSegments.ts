import type { NotificationType } from "@/api/fetch/notification";

export type AlertTitleSegment = {
  text: string;
  emphasize: boolean;
};

const CATEGORY_NEW_POST_SUFFIX_WITH_PERIOD = " 새 게시글이 등록되었어요.";
const CATEGORY_NEW_POST_SUFFIX_NO_PERIOD = " 새 게시글이 등록되었어요";

const HIGHLIGHT_PHRASE_BY_NOTIFICATION_TYPE: Partial<Record<NotificationType, string>> = {
  CHAT: "새로운 채팅",
  CHAT_REMINDER: "확인하지 않은 채팅",
  COMMENT: "새로운 댓글",
  FAVORITE: "즐겨찾기 한 게시글의 상태",
  INQUIRY_REPLY: "문의하신 내용에 답변",
  REPORT_RESULT: "신고에 대한 답변",
  NOTICE: "새로운 공지사항이 등록",
};

const splitByHighlightPhrase = (title: string, phrase: string): AlertTitleSegment[] => {
  const idx = title.indexOf(phrase);
  if (idx === -1) {
    return [{ text: title, emphasize: false }];
  }
  const out: AlertTitleSegment[] = [];
  if (idx > 0) {
    out.push({ text: title.slice(0, idx), emphasize: false });
  }
  out.push({ text: phrase, emphasize: true });
  const restStart = idx + phrase.length;
  if (restStart < title.length) {
    out.push({ text: title.slice(restStart), emphasize: false });
  }
  return out;
};

const splitCategoryAlertTitle = (title: string): AlertTitleSegment[] => {
  let cut = title.indexOf(CATEGORY_NEW_POST_SUFFIX_WITH_PERIOD);
  if (cut === -1) {
    cut = title.indexOf(CATEGORY_NEW_POST_SUFFIX_NO_PERIOD);
  }
  if (cut > 0) {
    return [
      { text: title.slice(0, cut), emphasize: true },
      { text: title.slice(cut), emphasize: false },
    ];
  }
  return [{ text: title, emphasize: false }];
};

export const getAlertTitleSegments = (
  type: NotificationType,
  title: string
): AlertTitleSegment[] => {
  if (type === "CATEGORY") {
    return splitCategoryAlertTitle(title);
  }

  const phrase = HIGHLIGHT_PHRASE_BY_NOTIFICATION_TYPE[type];
  if (!phrase) {
    return [{ text: title, emphasize: false }];
  }

  return splitByHighlightPhrase(title, phrase);
};
