import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { buildCanonicalAlternates } from "@/utils";
import { DefaultListView } from "./_components";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; keyword?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { type, keyword } = await searchParams;
  const t = await getTranslations("ListPage");

  const postType = type === "found" ? t("postTypeFound") : t("postTypeLost");

  // type 쿼리 변형(/list?type=lost 등)이 같은 화면이므로 canonical을 /list로 모은다.
  const alternates = buildCanonicalAlternates("/list", locale);

  if (keyword) {
    return {
      title: t("searchTitle", { keyword }),
      description: t("searchDescription", { keyword }),
      alternates,
      robots: { index: false, follow: true },
    };
  }

  return {
    title: t("listTitle", { postType }),
    description: t("listDescription", { postType }),
    alternates,
  };
}

const Page = () => {
  return (
    <Suspense fallback={null}>
      <DefaultListView />
    </Suspense>
  );
};

export default Page;
