import { useLayoutEffect, useState, RefObject } from "react";

const useChatInitialScroll = (
  scrollRef: RefObject<HTMLDivElement | null>,
  scrollHeightRef: RefObject<number>
) => {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    scrollHeightRef.current = scrollRef.current.scrollHeight;
    setReady(true);
  }, []);

  return ready;
};

export default useChatInitialScroll;
