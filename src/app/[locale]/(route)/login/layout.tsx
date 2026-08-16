import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LoginLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "login" },
  };
}

const layout = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback="">{children}</Suspense>;
};

export default layout;
