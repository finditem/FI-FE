import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFoundView from "@/components/state/NotFoundView/NotFoundView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const NotFound = () => {
  return <NotFoundView />;
};

export default NotFound;
