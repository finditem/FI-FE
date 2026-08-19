import { DetailHeader, MypageSearch } from "@/components";
import { MypageInquiriesContent, MypageInquiriesFilter } from "./_components";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("MypageInquiriesPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="inquiries" />

        <MypageInquiriesFilter />

        <MypageInquiriesContent />
      </div>
    </>
  );
};

export default page;
