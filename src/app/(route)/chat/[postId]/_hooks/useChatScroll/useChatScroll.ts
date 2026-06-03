import { RefObject, useLayoutEffect, useRef } from "react";
import { ChatMessage } from "@/api/fetch/chatMessage/types/ChatMessageResponse";

const useChatScroll = (
  scrollRef: RefObject<HTMLDivElement | null>,
  chatMessages: ChatMessage[],
  myId: number
) => {
  const prevLengthRef = useRef<number>(0);
  const isInitialRef = useRef(true);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !myId || chatMessages.length === 0) return;

    const prevLength = prevLengthRef.current;
    const currentLength = chatMessages.length;

    if (!isInitialRef.current && currentLength <= prevLength) {
      prevLengthRef.current = currentLength;
      return;
    }

    const last = chatMessages[currentLength - 1];

    if (isInitialRef.current) {
      el.scrollTop = el.scrollHeight;
      isInitialRef.current = false;
    } else if (currentLength === prevLength + 1 && last.senderId === myId) {
      el.classList.add("scroll-smooth");
      el.scrollTop = el.scrollHeight;

      requestAnimationFrame(() => {
        el.classList.remove("scroll-smooth");
      });
    }

    prevLengthRef.current = currentLength;
  }, [chatMessages.length, myId, scrollRef, chatMessages]);
};

export default useChatScroll;
