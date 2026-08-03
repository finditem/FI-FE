import { useEffect, useLayoutEffect, useRef, RefObject } from "react";

interface UseChatInfiniteScroll {
  scrollRef: RefObject<HTMLDivElement | null>;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  chatMessagesLength: number;
}

const useChatInfiniteScroll = ({
  scrollRef,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  chatMessagesLength,
}: UseChatInfiniteScroll) => {
  const prevScrollHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0);
  const prevLengthRef = useRef<number>(chatMessagesLength);
  const shouldPreserveScrollRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop <= 20 && hasNextPage && !isFetchingNextPage) {
        // 페칭 전 스크롤 위치와 높이 저장
        prevScrollHeightRef.current = el.scrollHeight;
        prevScrollTopRef.current = el.scrollTop;
        prevLengthRef.current = chatMessagesLength;
        shouldPreserveScrollRef.current = true;
        fetchNextPage();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, fetchNextPage, hasNextPage, isFetchingNextPage, chatMessagesLength]);

  // 데이터 로드 완료 후 스크롤 보정 (chatMessagesLength 변경 감지)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !shouldPreserveScrollRef.current || isFetchingNextPage) return;

    // 메시지가 실제로 추가되었는지 확인
    if (chatMessagesLength <= prevLengthRef.current) {
      shouldPreserveScrollRef.current = false;
      return;
    }

    const newScrollHeight = el.scrollHeight;
    const prevScrollHeight = prevScrollHeightRef.current;
    const scrollDiff = newScrollHeight - prevScrollHeight;

    if (scrollDiff > 0) {
      // 이전 스크롤 위치를 기준으로 보정
      // 위에 추가된 내용만큼 아래로 이동하여 같은 내용을 보고 있도록 유지
      el.scrollTop = prevScrollTopRef.current + scrollDiff;
    }

    shouldPreserveScrollRef.current = false;
    prevLengthRef.current = chatMessagesLength;
  }, [isFetchingNextPage, chatMessagesLength, scrollRef]);
};

export default useChatInfiniteScroll;
