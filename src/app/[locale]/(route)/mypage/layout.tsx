import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MyPageLayout");

  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    other: { "page-type": "mypage" },
  };
}

export default function layout({ children }: { children: ReactNode }) {
  return children;
}
