"use client";

import { FooterItem } from "./_internal";
import useFooterNav from "./_hooks/useFooterNav";

const FOOTER_HEIGHT = "h-[86.67px]";

/**
 * 앱 하단 고정 내비게이션(탭) 영역입니다.
 *
 * @remarks
 * - `"use client"`이며 `useFooterNav`로 노출 여부·항목 목록을 가져옵니다.
 * - 숨김 경로(`isHidden`)이면 `null`만 반환합니다.
 * - `fixed` 푸터와 동일 높이의 자리 표시 `div`로 본문과 겹침을 줄입니다.
 *
 * @author hyungjun
 
/**
 * @example
 * ```tsx
 * // 레이아웃 루트 등에서 한 번만 배치
 * <Footer />
 * ```
 */

const Footer = () => {
  const { isHidden, items } = useFooterNav();
  if (isHidden) return null;

  return (
    <>
      <footer className="fixed bottom-0 mx-auto w-full max-w-[764px] overflow-visible border-t-[1.2px] border-divider-default bg-white px-5 pb-[27px] pt-[14px]">
        <nav className="flex justify-between text-caption2-medium text-labelsVibrant-secondary">
          {items.map((item) => (
            <FooterItem key={item.key} item={item} />
          ))}
        </nav>
      </footer>
      <div className={FOOTER_HEIGHT} aria-hidden />
    </>
  );
};

export default Footer;
