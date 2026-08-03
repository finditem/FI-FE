import { useEffect, useRef, RefObject } from "react";

interface UseChatScrollPreserveParams {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollHeightRef: RefObject<number>;
  isFetchingNextPage: boolean;
  chatMessagesLength: number;
}

const useChatScrollPreserve = ({
  scrollRef,
  scrollHeightRef,
  isFetchingNextPage,
  chatMessagesLength,
}: UseChatScrollPreserveParams) => {
  const prevLengthRef = useRef<number>(chatMessagesLength);
  const wasFetchingRef = useRef<boolean>(isFetchingNextPage);
  const rafIdRef = useRef<number | null>(null);

  // 페칭 중 스크롤 높이 추적 (useChatScrollHeightTracking 로직 통합)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isFetchingNextPage) return;

    scrollHeightRef.current = el.scrollHeight;
  }, [isFetchingNextPage, scrollRef, scrollHeightRef]);

  // 메시지 추가 시 스크롤 위치 보존
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 무한스크롤로 인한 데이터 추가인지 확인
    // 페칭이 끝났고, 이전에 페칭 중이었다면 무한스크롤로 인한 추가
    const isInfiniteScroll = !isFetchingNextPage && wasFetchingRef.current;
    const wasFetching = wasFetchingRef.current;
    wasFetchingRef.current = isFetchingNextPage;

    // 무한스크롤인 경우 useChatInfiniteScroll에서 처리하므로 여기서는 완전히 스킵
    if (isInfiniteScroll) {
      // 기존 RAF 취소
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      // 높이만 업데이트하고 스크롤 위치는 건드리지 않음
      scrollHeightRef.current = el.scrollHeight;
      prevLengthRef.current = chatMessagesLength;
      return;
    }

    // 페칭 중이거나 메시지가 감소한 경우 스킵
    if (isFetchingNextPage || chatMessagesLength <= prevLengthRef.current) {
      if (!wasFetching) {
        scrollHeightRef.current = el.scrollHeight;
        prevLengthRef.current = chatMessagesLength;
      }
      return;
    }

    // 새 메시지가 아래에 추가된 경우에만 스크롤 위치 보존
    // 기존 RAF 취소
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // 스크롤 업데이트를 RAF로 배치 처리하여 다른 훅과의 충돌 방지
    rafIdRef.current = requestAnimationFrame(() => {
      if (!el) return;

      const prevScrollHeight = scrollHeightRef.current;
      if (el.scrollHeight !== prevScrollHeight && prevScrollHeight > 0) {
        const scrollDiff = el.scrollHeight - prevScrollHeight;
        // 아래에 추가된 경우 스크롤 위치 유지
        el.scrollTop = el.scrollTop + scrollDiff;
      }

      scrollHeightRef.current = el.scrollHeight;
      prevLengthRef.current = chatMessagesLength;
      rafIdRef.current = null;
    });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isFetchingNextPage, chatMessagesLength, scrollRef, scrollHeightRef]);
};

export default useChatScrollPreserve;
