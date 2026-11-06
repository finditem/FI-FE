import type { Metadata } from "next";
import { NoticeDetailHeader, NoticeDetailView } from "./_components";
import { getTranslations } from "next-intl/server";

interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoticeDetailProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("NoticePage.detail");

  const notice = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/meta`, {
    next: { revalidate: 60 },
  }).then((res) => res.json());

  const result = notice?.result ?? {};
  // API가 null을 내려주면 구조 분해 기본값이 적용되지 않으므로 ??로 대체한다.
  const title = result.title ?? t("metaFallbackTitle");
  const description = result.description ?? t("metaFallbackDescription");
  const thumbnailUrl =
    result.thumbnailUrl ??
    "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: thumbnailUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [thumbnailUrl],
    },
  };
}

const NoticeDetail = async ({ params }: NoticeDetailProps) => {
  const { id } = await params;

  return (
    <>
      <NoticeDetailHeader id={Number(id)} />
      <NoticeDetailView id={Number(id)} />
    </>
  );
};

export default NoticeDetail;
