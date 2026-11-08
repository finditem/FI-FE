import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DetailHeader } from "@/components";

export const metadata: Metadata = {
  other: { "page-type": "write-post-location" },
};

const layout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations("PostWriteLocationLayout");

  return (
    <div className="min-h-dvh w-full">
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyPageTitle")}</h1>

      {children}
    </div>
  );
};

export default layout;
