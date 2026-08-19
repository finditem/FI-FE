import type { Metadata } from "next";
import { ReactNode } from "react";
import { DetailHeader } from "@/components";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MypageProfileLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "mypage-profile" },
  };
}

const layout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations("MypageProfileLayout");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>

      {children}
    </>
  );
};

export default layout;
