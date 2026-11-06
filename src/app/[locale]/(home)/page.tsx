import { BottomSheet, MainNaverMap, MainSearchHeader } from "./_components";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { buildCanonicalAlternates } from "@/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { search } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Home" });

  const title = search ? t("searchTitle", { search }) : t("defaultTitle");
  const description = search ? t("searchDescription", { search }) : t("defaultDescription");

  return {
    title,
    description,
    alternates: buildCanonicalAlternates("/", locale),
    // 검색어가 담긴 주소는 임의 문구가 제목으로 색인되지 않도록 색인에서 제외한다.
    ...(search && { robots: { index: false, follow: true } }),
  };
}

const Page = () => {
  return (
    <div className="h-[calc(100dvh-87px)]">
      <MainSearchHeader />
      <Suspense fallback={null}>
        <MainNaverMap />
      </Suspense>
      <BottomSheet />
    </div>
  );
};

export default Page;
