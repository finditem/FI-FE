import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AppleCallback");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    other: { "page-type": "apple-callback" },
  };
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback="">{children}</Suspense>;
};

export default layout;
