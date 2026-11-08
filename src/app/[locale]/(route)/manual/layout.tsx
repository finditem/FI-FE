import { DetailHeader } from "@/components";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ManualLayout");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    other: { "page-type": "manual" },
  };
}

const layout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("ManualLayout");

  return (
    <>
      <DetailHeader title={t("headerTitle")} />
      <h1 className="sr-only">{t("srHeading")}</h1>
      <section className="w-full h-base">{children}</section>
    </>
  );
};

export default layout;
