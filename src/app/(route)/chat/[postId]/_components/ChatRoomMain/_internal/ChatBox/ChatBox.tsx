import { cn, formatChatTime } from "@/utils";
import { CHAT_SENDER_STYLE } from "../../../CHATROOM_CONST";
import ChatImageBox from "../ChatImageBox/ChatImageBox";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import { useGetUsersMe } from "@/api/fetch/user";
import ExpandableMessageBubble from "./_internal/ExpandableMessageBubble";

interface ChatBoxProps {
  chat: ChatMessage;
  nextSender?: "me" | "other";
  lastChat?: boolean;
  opponentNickname?: string;
}

const ChatBox = ({ chat, nextSender, lastChat, opponentNickname }: ChatBoxProps) => {
  const { content, createdAt, imageUrls, messageType, senderId } = chat;
  const { data: userInfo } = useGetUsersMe();

  const sender = Number(userInfo?.result?.userId) === senderId ? "me" : "other";
  const marginBottom = lastChat ? "mb-0" : nextSender === sender ? "mb-2" : "mb-4";

  const style = CHAT_SENDER_STYLE[sender];
  return (
    <div className={cn("flex items-end gap-2", style.container, marginBottom)}>
      <time className={cn("text-caption1-medium text-layout-body-default", style.timeOrder)}>
        {formatChatTime(createdAt)}
      </time>
      {messageType === "TEXT" && (
        <ExpandableMessageBubble
          content={content}
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
