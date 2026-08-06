"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale =
    routing.locales.find((candidate) => candidate !== locale) ?? routing.defaultLocale;

  const handleClick = () => {
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  };

  return (
    <button
      type="button"
      data-testid="language-switcher"
      aria-label={t("label")}
      onClick={handleClick}
      className="fixed bottom-[100px] right-4 z-20 rounded-full border border-divider-default bg-white px-3 py-1.5 text-caption2-medium text-labelsVibrant-secondary shadow-sm"
    >
      {t(nextLocale)}
    </button>
  );
};

export default LanguageSwitcher;
