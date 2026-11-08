"use client";

import { FilterSection, MypageSearch, DetailHeader } from "@/components";
import { useTranslations } from "next-intl";
import { MypageFavoritesContent } from "./_components";

const page = () => {
  const t = useTranslations("MypageFavoritesPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="favorites" />

        <FilterSection pageType="MY_FAVORITES" />

        <MypageFavoritesContent />
      </div>
    </>
  );
};

export default page;
