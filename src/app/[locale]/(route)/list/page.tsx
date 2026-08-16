import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { DefaultListView } from "./_components";

interface PageProps {
  searchParams: Promise<{ type?: string; keyword?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { type, keyword } = await searchParams;
  const t = await getTranslations("ListPage");

  const postType = type === "found" ? t("postTypeFound") : t("postTypeLost");

  if (keyword) {
    return {
      title: t("searchTitle", { keyword }),
      description: t("searchDescription", { keyword }),
    };
  }

  return {
    title: t("listTitle", { postType }),
    description: t("listDescription", { postType }),
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
