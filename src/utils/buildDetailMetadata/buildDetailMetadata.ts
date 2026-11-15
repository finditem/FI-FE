import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildCanonicalAlternates } from "../buildCanonicalAlternates/buildCanonicalAlternates";

interface BuildDetailMetadataParams {
  /** 현재 로케일 */
  locale: string;
  /** 로케일 접두사를 제외한 상세 경로 (예: `"/list/1"`). canonical과 `og:url`에 함께 쓰입니다. */
  path: string;
  /** 공유 카드 제목 */
  title: string;
  /** 공유 카드 설명 */
  description: string;
  /** 공유 카드 이미지 주소 */
  imageUrl: string;
  /** 공유 카드 이미지 대체 텍스트 (default: `title`) */
  imageAlt?: string;
}

/**
 * 상세 페이지의 canonical과 공유 카드(Open Graph, Twitter) 메타데이터를 만듭니다.
 *
 * @remarks
 * - Next.js는 `openGraph`와 `twitter`를 깊게 병합하지 않고 통째로 덮어씁니다. 상세 페이지가 이미지만
 *   지정해도 루트 레이아웃의 `og:type`, `og:site_name`, `og:locale`, `twitter:card`가 사라지므로,
 *   이 유틸이 루트와 같은 기본값을 다시 채웁니다.
 * - 상세 콘텐츠이므로 `og:type`은 `article`로 둡니다.
 * - `next-intl/server`를 쓰므로 서버의 `generateMetadata`에서만 호출합니다. `@/utils` 배럴에 넣지 않고
 *   경로로 직접 import합니다(`buildCanonicalAlternates`와 같은 이유로 클라이언트 번들에 섞이지 않게 함).
 *
 * @author suhyeon
 */
/**
 * @example
 * ```ts
 * return {
 *   title: { absolute: title },
 *   description,
 *   ...(await buildDetailMetadata({ locale, path: `/list/${id}`, title, description, imageUrl })),
 * };
 * ```
 */
export const buildDetailMetadata = async ({
  locale,
  path,
  title,
  description,
  imageUrl,
  imageAlt = title,
}: BuildDetailMetadataParams): Promise<Pick<Metadata, "alternates" | "openGraph" | "twitter">> => {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const alternates = buildCanonicalAlternates(path, locale);

  return {
    alternates,
    openGraph: {
      type: "article",
      siteName: t("siteName"),
      locale: locale === "en" ? "en_US" : "ko_KR",
      url: alternates.canonical,
      title,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};
