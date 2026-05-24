"use client";

import { ChatBox, ChatDateDivider } from "./_internal";
import { useRef } from "react";
import { cn } from "@/utils";
import { useGetUsersMe } from "@/api/fetch/user";
import { enrichMessages } from "./utils/enrichMessages";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";
import useChatScrollOnSignal from "../../_hooks/useChatScrollOnSignal/useChatScrollOnSignal";
import useChatInfiniteScroll from "../../_hooks/useChatInfiniteScroll/useChatInfiniteScroll";
import useChatInitialScroll from "../../_hooks/useChatInitialScroll/useChatInitialScroll";
import useChatScrollPreserve from "../../_hooks/useChatScrollPreserve/useChatScrollPreserve";

interface ChatRoomMainProps {
  chatMessages: ChatMessage[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  opponentNickname?: string;
  scrollToBottomSignal: number;
}

const ChatRoomMain = ({
  chatMessages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  opponentNickname,
  scrollToBottomSignal,
}: ChatRoomMainProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollHeightRef = useRef<number>(0);
  const { data: userInfo } = useGetUsersMe();
  const userId = userInfo?.result?.userId != null ? Number(userInfo.result.userId) : undefined;
  useChatScrollOnSignal({ scrollRef, signal: scrollToBottomSignal });
  useChatInfiniteScroll({
    scrollRef,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    chatMessagesLength: chatMessages.length,
  });

  const ready = useChatInitialScroll(scrollRef, scrollHeightRef);

  useChatScrollPreserve({
    scrollRef,
    scrollHeightRef,
    isFetchingNextPage,
    chatMessagesLength: chatMessages.length,
  });

  const chatMessagesWithMetadata = enrichMessages(chatMessages, userId);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex flex-1 flex-col overflow-y-scroll bg-flatGray-25 px-4 py-2 no-scrollbar",
        !ready && "invisible"
      )}
    >
      {chatMessagesWithMetadata.map(({ chat, isNewDate, nextSender, lastChat }) => (
        <div key={chat.messageId}>
          {isNewDate && <ChatDateDivider createdAt={chat.createdAt} />}
          <ChatBox
            chat={chat}
            nextSender={nextSender}
            lastChat={lastChat}
            opponentNickname={opponentNickname}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatRoomMain;
