"use client";

import { useEffect, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import Icon from "../../Icon/Icon";
import { cn } from "@/utils";

const SCROLL_TOP_HIDE_THRESHOLD_PX = 200;

/**
 * 스크롤을 일정 이상 내린 뒤에만 나타나 맨 위로 부드럽게 올려 주는 버튼입니다.
 *
 * @remarks
 * - `"use client"`이며 `window` 스크롤 이벤트를 구독합니다.
 * - 뷰포트가 파일 상단 `SCROLL_TOP_HIDE_THRESHOLD_PX` 기준 이내면 렌더하지 않습니다.
 * - `onHide`가 `true`이면 스크롤 위치와 관계없이 숨깁니다.
 * - 클릭 시 `window.scrollTo`로 상단 이동(`behavior: 'smooth'`)합니다.
 * - 레이아웃(우측 하단 고정 등)은 부모에서 잡아 주어야 합니다.
 * - `aria-label`은 구현에서 고정 문자열을 씁니다.
 * - 타입상 `ButtonHTMLAttributes`를 확장하지만, 구현에서는 `onHide`와 `className`만 씁니다.
 *
 * @author hyungjun
 */
interface ScrollToTopButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `true`이면 스크롤과 무관하게 숨김 (default: false) */
  onHide?: boolean;
  /** 기본 원형 버튼 클래스에 이어 붙일 클래스 */
  className?: string;
}

/**
 * @example
 * ```tsx
 * // 기본
 * <ScrollToTopButton />
 *
 * // 모달 등 다른 UI가 열렸을 때 강제로 숨김
 * <ScrollToTopButton onHide={isModalOpen} />
 *
 * // 스타일 덧붙이기
 * <ScrollToTopButton className="shadow-lg" />
 * ```
 */

const ScrollToTopButton = ({ onHide = false, className }: ScrollToTopButtonProps) => {
  const [isNearTop, setIsNearTop] = useState(true);

  const handleScrollToTop = () => setIsNearTop(window.scrollY < SCROLL_TOP_HIDE_THRESHOLD_PX);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollToTop, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollToTop);
  }, [handleScrollToTop]);

  if (onHide || isNearTop) return null;

  return (
    <button
      aria-label="스크롤 맨 위로 이동"
      className={cn(
        "h-[70px] w-[70px] rounded-full border border-white transition-colors duration-150 bg-fill-brand-subtle-default flex-center",
        "hover:bg-fill-brand-subtle-hover",
        "active:bg-fill-brand-subtle-pressed",
        "disabled:bg-fill-brand-subtle-disabled",
        className
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Icon name="ScrollTopArrow" size={32} />
    </button>
  );
};

export default ScrollToTopButton;
