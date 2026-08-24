"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { FooterButton } from "@/components";
import LanguageOption from "./_internal/LanguageOption/LanguageOption";

type AppLocale = (typeof routing.locales)[number];

const FLAG_SRC: Record<AppLocale, string> = {
  ko: "/mypage/language/flag-kr.svg",
  en: "/mypage/language/flag-us.svg",
};

const LanguageSettingsContainer = () => {
  const locale = useLocale() as AppLocale;
  const tLanguage = useTranslations("LanguageSwitcher");
  const t = useTranslations("LanguageSettingsPage");
  const router = useRouter();

  const [selected, setSelected] = useState<AppLocale>(locale);

  const handleConfirm = () => {
    if (selected === locale) return;
    router.replace("/mypage", { locale: selected });
    router.refresh();
  };

  return (
    <>
      <div className="flex w-full flex-1 flex-col py-4">
        {routing.locales.map((option) => (
          <LanguageOption
            key={option}
            locale={option}
            flagSrc={FLAG_SRC[option]}
            label={tLanguage(option)}
            selected={selected === option}
            onSelect={() => setSelected(option)}
          />
        ))}
      </div>

      <FooterButton onClick={handleConfirm} disabled={selected === locale}>
        {t("changeButton")}
      </FooterButton>
    </>
  );
};

export default LanguageSettingsContainer;
