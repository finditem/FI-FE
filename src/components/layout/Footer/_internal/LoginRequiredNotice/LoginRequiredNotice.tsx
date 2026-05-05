"use client";

import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState } from "react";

const NOTICE_VERTICAL_OFFSET_PX = 42;

const LoginRequiredNotice = () => {
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.top - NOTICE_VERTICAL_OFFSET_PX,
    });
  }, []);

  return (
    <>
      <span
        ref={anchorRef}
        className="pointer-events-none absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2"
        aria-hidden
      />
      {position
        ? createPortal(
            <div
              role="alert"
              className="animate-float fixed z-[10001] -translate-x-1/2 select-none"
              style={{ left: position.left, top: position.top }}
            >
              <div className="relative rounded-2xl p-[10px] shadow-sm bg-fill-brand-subtle-default_2">
                <p className="whitespace-nowrap text-caption2-semibold text-brand-strongUseThis-hover">
                  로그인 후 이용하실 수 있어요
                </p>
                <div
                  className="pointer-events-none absolute left-1/2 top-full z-[1] h-[6px] w-[12px] -translate-x-1/2 -translate-y-px bg-fill-brand-subtle-default_2 [clip-path:polygon(50%_100%,0_0,100%_0)]"
                  aria-hidden
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default LoginRequiredNotice;
