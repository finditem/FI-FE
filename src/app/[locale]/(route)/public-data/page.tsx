import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PublicDataView, PublicDetailHeader } from "./_components";

interface PageProps {
  searchParams: Promise<{ type?: string; keyword?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { type, keyword } = await searchParams;
  const t = await getTranslations("PublicDataPage");

  if (keyword) {
    return {
      title: t("searchTitle", { keyword }),
      description: t("searchDescription", { keyword }),
    };
  }

  const postType = type === "found" ? t("postTypeFound") : t("postTypeLost");
  const postDescription = type === "found" ? t("postDescriptionFound") : t("postDescriptionLost");

  return {
    title: t("listTitle", { postType }),
    description: t("listDescription", { postDescription }),
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
