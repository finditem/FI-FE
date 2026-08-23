import { DetailHeader } from "@/components";
import { getTranslations } from "next-intl/server";
import { LanguageSettingsContainer } from "./_components";

const page = async () => {
  const t = await getTranslations("LanguageSettingsPage");

  return (
    <>
      <DetailHeader title={t("title")} />

      <div className="flex w-full flex-col h-base">
        <h1 className="sr-only">{t("srOnlyTitle")}</h1>

        <LanguageSettingsContainer />
      </div>
    </>
  );
};

export default page;
