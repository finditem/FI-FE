"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { usePopoverOutsideClose, usePopoverPosition } from "@/hooks";
import { Icon } from "@/components";
import { cn } from "@/utils";

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Login");
  const tLanguage = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  usePopoverOutsideClose(isOpen, anchorRef, dropdownRef, () => setIsOpen(false));
  usePopoverPosition(isOpen, anchorRef, dropdownRef);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (nextLocale: (typeof routing.locales)[number]) => {
    setIsOpen(false);
    if (nextLocale === locale) return;
    const query = searchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { locale: nextLocale });
    router.refresh();
  };

  return (
    <>
      <div ref={anchorRef}>
        <button
          type="button"
          aria-label={t("languageAriaLabel")}
          onClick={toggleDropdown}
          className="h-10 w-full gap-1.5 rounded-[10px] border border-neutral-normal-default bg-white px-3.5 text-body2-semibold text-neutral-normal-default flex-center"
        >
          {locale === routing.defaultLocale ? t("languageLabel") : tLanguage(locale)}
          <Icon name={isOpen ? "ArrowUp" : "ArrowDown"} size={18} />
        </button>
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="glass-card fixed z-50 flex flex-col overflow-hidden rounded-[20px] border border-white bg-flatGray-25/70"
          >
            {routing.locales.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={cn(
                  "h-10 w-full px-7 py-4 text-body2-semibold flex-center",
                  option === locale
                    ? "text-brand-strongUseThis-default bg-fill-brand-subtle-default_2"
                    : "text-neutral-normal-default"
                )}
              >
                {tLanguage(option)}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default LanguageDropdown;
