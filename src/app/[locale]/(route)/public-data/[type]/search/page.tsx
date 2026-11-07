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
    // 검색어가 담긴 결과 페이지는 색인에서 제외한다.
    robots: { index: false, follow: true },
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
