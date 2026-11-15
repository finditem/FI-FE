import { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components";
import { buildBreadcrumbJsonLd } from "@/utils/buildBreadcrumbJsonLd/buildBreadcrumbJsonLd";

export const metadata: Metadata = {
  other: { "page-type": "public-data-detail" },
};

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string; type: string; postId: string }>;
}

// 구조화 데이터는 page.tsx 대신 레이아웃에서 싣는다. 물품명 조회는 generateMetadata와 같은 요청이라
// fetch 캐시로 한 번만 호출된다.
const layout = async ({ children, params }: LayoutProps) => {
  const { locale, type, postId } = await params;

  if (type !== "lost" && type !== "found") return children;

  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const apiPath = type === "lost" ? "/api/public/lost" : "/api/public/found";

  const title: string | undefined = await fetch(`${protocol}://${host}${apiPath}?atcId=${postId}`, {
    next: { revalidate: 3600 },
  })
    .then((res) => (res.ok ? res.json() : undefined))
    .then((data) => {
      const item = Array.isArray(data?.items?.item) ? data.items.item[0] : data?.items?.item;
      return item?.fdPrdtNm || undefined;
    })
    .catch(() => undefined);

  if (!title) return children;

  const t = await getTranslations({ locale, namespace: "Breadcrumb" });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { name: t("home"), href: "/" },
            { name: t("publicData"), href: "/public-data" },
            { name: title, href: `/public-data/${type}/${postId}` },
          ],
          locale
        )}
      />
      {children}
    </>
  );
};

export default layout;
