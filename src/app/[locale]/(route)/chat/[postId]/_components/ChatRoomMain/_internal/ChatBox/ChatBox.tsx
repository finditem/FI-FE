import { useTranslations } from "next-intl";
import { cn, formatChatTime } from "@/utils";
import { CHAT_SENDER_STYLE } from "../../../CHATROOM_CONST";
import ChatImageBox from "../ChatImageBox/ChatImageBox";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import { useGetUsersMe } from "@/api/fetch/user";
import ExpandableMessageBubble from "../ExpandableMessageBubble/ExpandableMessageBubble";
import { Icon } from "@/components";
import useMessageTranslation from "../../../../_hooks/useMessageTranslation/useMessageTranslation";

interface ChatBoxProps {
  chat: ChatMessage;
  nextSender?: "me" | "other";
  lastChat?: boolean;
  opponentNickname?: string;
}

const ChatBox = ({ chat, nextSender, lastChat, opponentNickname }: ChatBoxProps) => {
  const t = useTranslations("ChatBox");
  const { content, createdAt, imageUrls, messageType, senderId } = chat;
  const { data: userInfo } = useGetUsersMe();
  const { displayContent, isTranslated, isTranslating, toggleTranslate } =
    useMessageTranslation(content);

  const sender = Number(userInfo?.result?.userId) === senderId ? "me" : "other";
  const marginBottom = lastChat ? "mb-0" : nextSender === sender ? "mb-2" : "mb-4";

  const style = CHAT_SENDER_STYLE[sender];
  return (
    <div className={cn("flex items-end", style.container, marginBottom)}>
      <div className={cn("flex w-11 flex-col items-center gap-1", style.timeOrder)}>
        {messageType === "TEXT" && (
          <button
            type="button"
            aria-label={isTranslated ? t("showOriginalAriaLabel") : t("translateAriaLabel")}
            aria-busy={isTranslating}
            disabled={isTranslating}
            onClick={toggleTranslate}
            className="flex h-9 w-full items-end justify-center disabled:opacity-50"
          >
            <span className="flex size-6 items-center justify-center rounded-[10px] bg-[#e4e4e4]">
              <Icon name="TranslateLanguage" size={14} />
            </span>
          </button>
        )}
        <time className="text-caption1-medium text-layout-body-default">
          {formatChatTime(createdAt)}
        </time>
      </div>
      {messageType === "TEXT" && (
        <ExpandableMessageBubble
          content={displayContent}
          bubbleColor={style.bubbleColor}
          bubbleOrder={style.bubbleOrder}
        />
      )}
      {messageType === "IMAGE" && (
        <ChatImageBox
          images={imageUrls}
          createdAt={createdAt}
          bubbleOrder={style.bubbleOrder}
          opponentNickname={opponentNickname}
        />
      )}
    </div>
  );
};

export default ChatBox;
