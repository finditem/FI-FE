import { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components";
import { buildBreadcrumbJsonLd } from "@/utils/buildBreadcrumbJsonLd/buildBreadcrumbJsonLd";

export const metadata: Metadata = {
  other: { "page-type": "list-detail" },
};

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string; id: string }>;
}

// 구조화 데이터는 page.tsx 대신 레이아웃에서 싣는다. 제목 조회는 generateMetadata와 같은 요청이라
// fetch 캐시로 한 번만 호출된다.
const layout = async ({ children, params }: LayoutProps) => {
  const { locale, id } = await params;
  const postId = Number(id);
  let title: string | undefined;

  if (Number.isInteger(postId) && postId > 0) {
    title = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/share`, {
      next: { revalidate: 600 },
    })
      .then((res) => res.json())
      .then((post) => post?.result?.title)
      .catch(() => undefined);
  }

  const t = await getTranslations({ locale, namespace: "Breadcrumb" });

  return (
    <>
      {title && (
        <JsonLd
          data={buildBreadcrumbJsonLd(
            [
              { name: t("home"), href: "/" },
              { name: t("list"), href: "/list" },
              { name: title, href: `/list/${postId}` },
            ],
            locale
          )}
        />
      )}
      {children}
    </>
  );
};

export default layout;
