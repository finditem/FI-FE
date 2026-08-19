import { DetailHeader, MypageSearch } from "@/components";
import { getTranslations } from "next-intl/server";
import { MypageCommentsContent, MypageCommentsFilterSection } from "./_components";

const page = async () => {
  const t = await getTranslations("MypageCommentsPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="comments" />

        <MypageCommentsFilterSection />

        <MypageCommentsContent />
      </div>
    </>
  );
};

export default page;
