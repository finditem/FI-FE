import { BottomSheet, MainKakaoMap, MainSearchHeader } from "./_components";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

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
  };
}

const Page = () => {
  return (
    <div className="h-[calc(100dvh-87px)]">
      <MainSearchHeader />
      <Suspense fallback={null}>
        <MainKakaoMap />
      </Suspense>
      <BottomSheet />
    </div>
  );
};

export default Page;
