import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildCanonicalAlternates } from "@/utils/buildCanonicalAlternates/buildCanonicalAlternates";
import { PublicDataView, PublicDetailHeader } from "./_components";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; keyword?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { type, keyword } = await searchParams;
  const t = await getTranslations("PublicDataPage");

  // type 쿼리 변형이 같은 화면이므로 canonical을 /public-data로 모은다.
  const alternates = buildCanonicalAlternates("/public-data", locale);

  if (keyword) {
    return {
      title: t("searchTitle", { keyword }),
      description: t("searchDescription", { keyword }),
      alternates,
      robots: { index: false, follow: true },
    };
  }

  const postType = type === "found" ? t("postTypeFound") : t("postTypeLost");
  const postDescription = type === "found" ? t("postDescriptionFound") : t("postDescriptionLost");

  return {
    title: t("listTitle", { postType }),
    description: t("listDescription", { postDescription }),
    alternates,
  };
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <PublicDetailHeader />

      <PublicDataView />
    </Suspense>
  );
};

export default page;
