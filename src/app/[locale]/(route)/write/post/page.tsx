import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WritePage } from "./_components";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { type } = await searchParams;
  const t = await getTranslations("PostWritePage");

  let title = t("defaultTitle");
  let description = t("defaultDescription");

  if (type === "lost") {
    title = t("lostTitle");
    description = t("lostDescription");
  } else {
    title = t("foundTitle");
    description = t("foundDescription");
  }

  return {
    title,
    description,
  };
}

const Page = () => {
  return (
    <Suspense fallback={null}>
      <WritePage />
    </Suspense>
  );
};

export default Page;
