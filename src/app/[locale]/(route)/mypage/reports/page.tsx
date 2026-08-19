import { DetailHeader, MypageSearch } from "@/components";
import { MypageReportsContent, MypageReportsFilter } from "./_components";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("MypageReportsPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="reports" />

        <MypageReportsFilter />

        <MypageReportsContent />
      </div>
    </>
  );
};

export default page;
