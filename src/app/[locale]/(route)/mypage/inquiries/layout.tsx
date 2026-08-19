import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MypageInquiriesLayout");

  return {
    title: t("title"),
    other: { "page-type": "mypage-inquiries" },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
