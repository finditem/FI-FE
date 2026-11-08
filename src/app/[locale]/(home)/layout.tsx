import type { Metadata } from "next";
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HomeLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "main" },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
