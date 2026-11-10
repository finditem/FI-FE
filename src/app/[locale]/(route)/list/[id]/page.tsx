import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { formatMetadataAddress } from "@/utils";
import { buildDetailMetadata } from "@/utils/buildDetailMetadata/buildDetailMetadata";
import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import ClientDetail from "./_components/ClientDetail/ClientDetail";

interface ListDetailProps {
  params: Promise<{ locale: string; id: string }>;
}

const postIdParamSchema = z.coerce.number().int().positive();

export async function generateMetadata({ params }: ListDetailProps): Promise<Metadata> {
  const { locale, id } = await params;
  const postId = postIdParamSchema.safeParse(id);

  if (!postId.success) return {};

  const t = await getTranslations("ListDetailPage");

  const post = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId.data}/share`, {
    next: { revalidate: 600 },
  }).then((res) => res.json());

  const postTypeLabel = post?.result?.postType === "LOST" ? t("postTypeLost") : t("postTypeFound");
  const address = formatMetadataAddress(post?.result?.address, t("defaultAddress"));

  const title = t("titleTemplate", {
    title: post?.result?.title ?? t("defaultItemName"),
    address,
    postType: postTypeLabel,
  });
  // 요약이 없으면 제목·주소·유형을 담은 고유 설명을 쓴다. 모든 게시글이 같은 설명을 갖지 않게 하기 위함이다.
  const description =
    post?.result?.summary ||
    t("defaultDescription", {
      title: post?.result?.title ?? t("defaultItemName"),
      address,
      postType: postTypeLabel,
    });
  const thumbnailUrl =
    post?.result?.thumbnailUrl ??
    "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png";

  return {
    title: {
      absolute: title,
    },
    description,
    ...(await buildDetailMetadata({
      locale,
      path: `/list/${postId.data}`,
      title,
      description,
      imageUrl: thumbnailUrl,
    })),
  };
}

const page = async ({ params }: ListDetailProps) => {
  const { id } = await params;
  const postId = postIdParamSchema.safeParse(id);

  if (!postId.success) notFound();

  const isLoggedIn = await hasValidToken();

  return <ClientDetail id={postId.data} isLoggedIn={isLoggedIn} />;
};

export default page;
