import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components";
import { SITE_LOGO_URL, SITE_URL } from "@/constants/SITE_URL";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { NoticeDetailResponse } from "@/api/fetch/notice/types/NoticeDetailType";
import { buildBreadcrumbJsonLd } from "@/utils/buildBreadcrumbJsonLd/buildBreadcrumbJsonLd";

export const metadata: Metadata = {
  other: { "page-type": "notice-detail" },
};

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string; id: string }>;
}

/** 백엔드 날짜에 시간대가 없으면 한국 시간으로 보고 오프셋을 붙인다. 구조화 데이터는 시간대를 요구한다. */
const toKstIsoString = (date: string) =>
  /[zZ]|[+-]\d{2}:?\d{2}$/.test(date) ? date : `${date}+09:00`;

// 구조화 데이터는 page.tsx 대신 레이아웃에서 싣는다. 상세 조회는 페이지 본문과 같은 요청이라
// fetch 캐시로 한 번만 호출된다.
const Layout = async ({ children, params }: LayoutProps) => {
  const { locale, id } = await params;
  const noticeId = Number(id);
  let notice: NoticeDetailResponse["result"] | undefined;

  if (Number.isInteger(noticeId) && noticeId > 0) {
    notice = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${noticeId}`, {
      next: { revalidate: 60 },
    })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((body: NoticeDetailResponse | undefined) => body?.result)
      .catch(() => undefined);
  }

  if (!notice) return children;

  const t = await getTranslations({ locale, namespace: "Breadcrumb" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const path = `/notice/${noticeId}`;
  const pageUrl = `${SITE_URL}${getPathname({ locale: locale as (typeof routing.locales)[number], href: path })}`;
  const organization = {
    "@type": "Organization",
    name: tMeta("siteName"),
    url: SITE_URL,
    logo: SITE_LOGO_URL,
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: notice.title,
    description: notice.summary || notice.content?.slice(0, 120),
    ...(notice.images?.length || notice.thumbnailUrl
      ? { image: notice.images?.length ? notice.images : [notice.thumbnailUrl] }
      : {}),
    datePublished: toKstIsoString(notice.createdAt),
    dateModified: toKstIsoString(notice.updatedAt || notice.createdAt),
    author: organization,
    publisher: organization,
    mainEntityOfPage: pageUrl,
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { name: t("home"), href: "/" },
            { name: t("notice"), href: "/notice" },
            { name: notice.title, href: path },
          ],
          locale
        )}
      />
      {children}
    </>
  );
};

export default Layout;
