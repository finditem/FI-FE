import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotificationSettingsLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "mypage-notifications" },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
