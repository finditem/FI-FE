import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ChangePassword");

  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    other: { "page-type": "change-password" },
  };
}

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
