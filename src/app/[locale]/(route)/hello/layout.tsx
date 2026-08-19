import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DetailHeader } from "@/components";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HelloPage");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    other: { "page-type": "hello" },
  };
}

const layout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations("HelloPage");

  return (
    <>
      <DetailHeader />
      <h1 className="sr-only">{t("heading")}</h1>
      {children}
    </>
  );
};

export default layout;
