import { RefObject, useLayoutEffect, useRef } from "react";

interface UseChatScrollOnSignalParams {
  scrollRef: RefObject<HTMLDivElement | null>;
  signal: number;
}

const useChatScrollOnSignal = ({ scrollRef, signal }: UseChatScrollOnSignalParams) => {
  const prevSignalRef = useRef(signal);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (signal === prevSignalRef.current) return;

    el.classList.add("scroll-smooth");
    el.scrollTop = el.scrollHeight;

    requestAnimationFrame(() => {
      el.classList.remove("scroll-smooth");
    });

    prevSignalRef.current = signal;
  }, [scrollRef, signal]);
};

export default useChatScrollOnSignal;
