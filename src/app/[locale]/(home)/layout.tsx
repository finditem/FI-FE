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

export default async function Layout({ children }: { children: ReactNode }) {
  const t = await getTranslations("HomeLayout");

  return (
    <>
      {/* 홈은 지도 중심 화면이라 보이는 제목이 없어, 검색엔진과 스크린 리더를 위한 h1을 둔다. */}
      <h1 className="sr-only">{t("title")}</h1>
      {children}
    </>
  );
}
