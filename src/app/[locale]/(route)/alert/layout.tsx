import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AlertLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "alert" },
  };
}

const layout = ({ children }: { children: ReactNode }) => {
  return <div className="h-f-base">{children}</div>;
};

export default layout;
