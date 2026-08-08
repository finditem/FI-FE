import { useEffect, useRef } from "react";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";

interface UseInitialChatPaginationParams {
  chatMessages: ChatMessage[] | undefined;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

const useInitialChatPagination = ({
  chatMessages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInitialChatPaginationParams) => {
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (
      chatMessages &&
      chatMessages.length > 0 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !initialFetchRef.current
    ) {
      initialFetchRef.current = true;
      fetchNextPage();
    }
  }, [chatMessages, hasNextPage, isFetchingNextPage, fetchNextPage]);
};

export default useInitialChatPagination;
