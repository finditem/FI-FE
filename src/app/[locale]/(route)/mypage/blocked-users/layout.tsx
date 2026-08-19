import { ReactNode } from "react";
import type { Metadata } from "next";
import { DetailHeader } from "@/components";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  other: { "page-type": "mypage-blocked-users" },
};

const layout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations("BlockedUsersLayout");

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("title")}</h1>

      {children}
    </>
  );
};

export default layout;
