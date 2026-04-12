"use client";

import { FooterItem } from "./_internal";
import useFooterNav from "./_hooks/useFooterNav";

const FOOTER_HEIGHT = "h-[86.67px]";

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
