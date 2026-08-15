import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { PublicClientDetail } from "./_components";

interface PublicDataDetailProps {
  params: Promise<{ type: string; postId: string }>;
}

export async function generateMetadata({ params }: PublicDataDetailProps): Promise<Metadata> {
  const { type, postId } = await params;
  const isLost = type === "lost";
  const t = await getTranslations("PublicDataDetailPage");

  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const apiPath = isLost ? "/api/public/lost" : "/api/public/found";
  const url = `${baseUrl}${apiPath}?atcId=${postId}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("데이터 요청에 실패했습니다.");

    const data = await res.json();
    const itemData = Array.isArray(data.items?.item) ? data.items.item[0] : data.items?.item;

    if (!itemData) throw new Error("데이터를 찾을 수 없습니다.");

    const title = itemData.fdPrdtNm || t("defaultItemName");
    const place = isLost ? itemData.depPlace : itemData.fdPlace;
    const content = isLost ? itemData.fdSbjt : itemData.uniq;
    const summary = content ? content.slice(0, 120) : t("defaultSummary");

    const metaTitle = t("metaTitleTemplate", {
      title,
      postType: isLost ? t("lostLabel") : t("foundLabel"),
      place: place || t("defaultPlace"),
    });
    const thumbnailUrl =
      itemData.fdFilePathImg && !itemData.fdFilePathImg.includes("no_img.gif")
        ? itemData.fdFilePathImg
        : "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png";

    return {
      title: metaTitle,
      description: summary,
      openGraph: {
        title: metaTitle,
        description: summary,
        images: [
          {
            url: thumbnailUrl,
            alt: metaTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: summary,
        images: [thumbnailUrl],
      },
    };
  } catch (error) {
    return {
      title: t("fallbackTitle"),
      description: t("fallbackDescription"),
    };
  }
}

const page = async ({ params }: PublicDataDetailProps) => {
  const { postId } = await params;

  return <PublicClientDetail id={postId} />;
};

export default page;
