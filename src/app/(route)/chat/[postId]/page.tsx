"use client";

import { ChatRoomHeader, EmptyChatRoom, ChatRoomMain, InputChat } from "./_components";
import { FormProvider, useForm } from "react-hook-form";
import { use, useCallback, useEffect, useState } from "react";
import useChatMessages from "@/api/fetch/chatMessage/api/useChatMessages";
import {
  useChatRoomData,
  useInitialChatPagination,
  useChatSocketMessage,
  useChatMessageSubmit,
} from "./_hooks";
import useReadMessage from "@/api/fetch/chatMessage/api/useReadMessage";
import { useToast } from "@/context/ToastContext";

interface ChatFormValues {
  content: string;
}

const ChatRoom = ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId: postIdString } = use(params);
  const { addToast } = useToast();
  const postId = Number(postIdString);

  const { roomId, chatRoomData, userInfo, postMode, unreadCount, withdrawn } =
    useChatRoomData(postId);
  const userId = Number(userInfo?.result?.userId);
  const currentUserId = userId != null ? userId : undefined;
  const [scrollToBottomSignal, setScrollToBottomSignal] = useState(0);
  const triggerScrollToBottom = useCallback(() => {
    setScrollToBottomSignal((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (withdrawn) {
      addToast("알 수 없는 사용자이거나 탈퇴한 회원이에요", "warning");
    }
  }, [withdrawn, addToast]);

  useChatSocketMessage(roomId, currentUserId);

  const { mutate: readMessage } = useReadMessage(roomId);
  const {
    data: chatMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(roomId, { enabled: !!roomId });

  useInitialChatPagination({
    chatMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useEffect(() => {
    if (unreadCount && unreadCount > 0 && roomId) {
      readMessage(roomId);
    }
  }, [unreadCount, roomId]);

  const methods = useForm<ChatFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const { onSubmit } = useChatMessageSubmit({
    roomId,
    userId,
    reset: methods.reset,
    onSendSuccess: triggerScrollToBottom,
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <ChatRoomHeader
        chatRoom={chatRoomData}
        roomId={roomId}
        currentUserId={currentUserId}
        withdrawn={withdrawn}
      />
      <h1 className="sr-only">채팅 상세 페이지</h1>

      <div className="flex min-h-0 flex-1 flex-col">
        {chatMessages?.length !== 0 && chatMessages ? (
          <ChatRoomMain
            chatMessages={chatMessages}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            opponentNickname={chatRoomData?.opponentUser.nickname}
            scrollToBottomSignal={scrollToBottomSignal}
          />
        ) : (
          <EmptyChatRoom postMode={postMode} />
        )}
      </div>
      {roomId && userId ? (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="px-4 pb-6 pt-3">
            <InputChat
              name="content"
              aria-label="채팅 입력창"
              roomId={roomId}
              userId={userId}
              onImageSendSuccess={triggerScrollToBottom}
              withdrawn={withdrawn}
            />
          </form>
        </FormProvider>
      ) : null}
    </div>
  );
};

export default ChatRoom;
