import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { NoticeDetailHeader, NoticeDetailView } from "./_components";
import { buildDetailMetadata } from "@/utils/buildDetailMetadata/buildDetailMetadata";
import { getTranslations } from "next-intl/server";
import { getNoticeDetailOnServer } from "./_utils/getNoticeDetailOnServer/getNoticeDetailOnServer";

interface NoticeDetailProps {
  params: Promise<{ locale: string; id: string }>;
}

const noticeIdParamSchema = z.coerce.number().int().positive();

export async function generateMetadata({ params }: NoticeDetailProps): Promise<Metadata> {
  const { locale, id } = await params;
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
    ...(await buildDetailMetadata({
      locale,
      path: `/notice/${id}`,
      title,
      description,
      imageUrl: thumbnailUrl,
    })),
  };
}

const NoticeDetail = async ({ params }: NoticeDetailProps) => {
  const { id } = await params;
  const noticeId = noticeIdParamSchema.safeParse(id);

  // 숫자가 아닌 id와 존재하지 않는 공지는 200 soft 404 대신 실제 404로 응답한다.
  if (!noticeId.success) notFound();

  const noticeResult = await getNoticeDetailOnServer(noticeId.data);
  if (noticeResult.status === "notFound") notFound();

  return (
    <>
      <NoticeDetailHeader id={noticeId.data} />
      <NoticeDetailView
        id={noticeId.data}
        initialNotice={noticeResult.status === "found" ? noticeResult.notice : undefined}
      />
    </>
  );
};

export default NoticeDetail;
