import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { formatMetadataKeyword } from "@/utils";
import { PublicDataSearchContent, PublicDataSearchDetailHeader } from "./_components";

interface PageProps {
  searchParams: Promise<{ keyword?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { keyword } = await searchParams;
  const t = await getTranslations("PublicDataSearchPage");
  const displayKeyword = formatMetadataKeyword(keyword, t("defaultKeyword"));

  return {
    title: t("searchTitle", { keyword: displayKeyword }),
    description: t("searchDescription", { keyword: displayKeyword }),
  };
}

const page = () => {
  return (
    <>
      <PublicDataSearchDetailHeader />

      <Suspense fallback={null}>
        <PublicDataSearchContent />
      </Suspense>
    </>
  );
};

export default page;
