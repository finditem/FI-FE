import { DetailHeader } from "@/components";
import { ReactNode } from "react";
import { FloatingInquiryButton } from "./_components";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SupportLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "support" },
  };
}

const Layout = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("SupportLayout");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("title")}</h1>
      {children}
      <FloatingInquiryButton />
    </>
  );
};

export default Layout;
