import { DetailHeader } from "@/components";
import { NotificationSettingList } from "./_components";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("NotificationSettingsPage");

  return (
    <>
      <DetailHeader title={t("title")} />

      <div className="w-full h-base">
        <h1 className="sr-only">{t("srOnlyTitle")}</h1>

        <NotificationSettingList />
      </div>
    </>
  );
};

export default page;
