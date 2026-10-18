import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ReviewDetailHeader } from "./_components";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ReviewDetailLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "review-detail" },
  };
}

const ReviewDetailLayout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations("ReviewDetailPage");

  return (
    <div className="bg-glassGreen-600">
      <ReviewDetailHeader title={t("title")} backAriaLabel={t("backAriaLabel")} />
      {children}
    </div>
  );
};

export default ReviewDetailLayout;
