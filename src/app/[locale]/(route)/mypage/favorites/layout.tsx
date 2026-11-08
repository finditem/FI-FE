import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MypageFavoritesLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "mypage-favorites" },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
