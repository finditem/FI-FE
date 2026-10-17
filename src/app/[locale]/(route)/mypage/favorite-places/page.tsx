"use client";

import { DetailHeader } from "@/components";
import { useTranslations } from "next-intl";
import { MypageFavoritePlacesContent } from "./_components";

const page = () => {
  const t = useTranslations("MypageFavoritePlacesPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full px-5 h-base">
        <MypageFavoritePlacesContent />
      </div>
    </>
  );
};

export default page;
