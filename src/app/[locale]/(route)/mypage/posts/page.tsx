"use client";

import { DetailHeader, FilterSection, MypageSearch } from "@/components";
import { useTranslations } from "next-intl";
import { MypagePostsContent } from "./_components";

const page = () => {
  const t = useTranslations("MypagePostsPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="posts" />

        <FilterSection pageType="MY_POSTS" />

        <MypagePostsContent />
      </div>
    </>
  );
};

export default page;
