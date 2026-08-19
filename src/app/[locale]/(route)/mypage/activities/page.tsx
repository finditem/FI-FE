import { MypageSearch, DetailHeader } from "@/components";
import { getTranslations } from "next-intl/server";
import { ActivityContent, ActivityFilterSection } from "./_components";

const page = async () => {
  const t = await getTranslations("MypageActivitiesPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="activities" />

        <ActivityFilterSection />

        <ActivityContent />
      </div>
    </>
  );
};

export default page;
