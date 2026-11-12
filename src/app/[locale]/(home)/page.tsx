import { BottomSheet, MainNaverMap, MainSearchHeader } from "./_components";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { buildCanonicalAlternates } from "@/utils/buildCanonicalAlternates/buildCanonicalAlternates";
import { JsonLd } from "@/components";
import { SITE_LOGO_URL, SITE_URL } from "@/constants/SITE_URL";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { search } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Home" });

  const title = search ? t("searchTitle", { search }) : t("defaultTitle");
  const description = search ? t("searchDescription", { search }) : t("defaultDescription");

  return {
    title,
    description,
    alternates: buildCanonicalAlternates("/", locale),
    // 검색어가 담긴 주소는 임의 문구가 제목으로 색인되지 않도록 색인에서 제외한다.
    ...(search && { robots: { index: false, follow: true } }),
  };
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const homeUrl = `${SITE_URL}${getPathname({ locale: locale as (typeof routing.locales)[number], href: "/" })}`;

  // 검색 결과에 사이트 이름과 로고가 표시되도록 홈에 WebSite, Organization 구조화 데이터를 싣는다.
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: t("siteName"),
        url: homeUrl,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: t("siteName"),
        url: SITE_URL,
        logo: SITE_LOGO_URL,
      },
    ],
  };

  return (
    <div className="h-[calc(100dvh-87px)]">
      <JsonLd data={siteJsonLd} />
      <MainSearchHeader />
      <Suspense fallback={null}>
        <MainNaverMap />
      </Suspense>
      <BottomSheet />
    </div>
  );
};

export default Page;
