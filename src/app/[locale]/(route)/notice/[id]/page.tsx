import type { Metadata } from "next";
import { NoticeDetailHeader, NoticeDetailView } from "./_components";

interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoticeDetailProps): Promise<Metadata> {
  const { id } = await params;

  const notice = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/meta`, {
    next: { revalidate: 60 },
  }).then((res) => res.json());

  const {
    title = "공지 상세",
    description = "공지 상세 내용",
    thumbnailUrl = "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png",
  } = notice?.result ?? {};

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
