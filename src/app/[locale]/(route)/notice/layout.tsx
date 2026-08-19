import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NoticePage");

  return {
    title: { absolute: t("metaTitle"), template: t("metaTitleTemplate") },
    description: t("metaDescription"),
    other: { "page-type": "notice-list" },
  };
}

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
