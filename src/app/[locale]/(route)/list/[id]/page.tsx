import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { formatMetadataAddress } from "@/utils";
import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import ClientDetail from "./_components/ClientDetail/ClientDetail";
import { getPostDetailOnServer } from "./_utils/getPostDetailOnServer/getPostDetailOnServer";

interface ListDetailProps {
  params: Promise<{ id: string }>;
}

const postIdParamSchema = z.coerce.number().int().positive();

export async function generateMetadata({ params }: ListDetailProps): Promise<Metadata> {
  const { id } = await params;
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
  const description = post?.result?.summary ?? t("defaultDescription");
  const thumbnailUrl =
    post?.result?.thumbnailUrl ??
    "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png";

  return {
    title: {
      absolute: title,
    },
    description,
    openGraph: {
      images: [
        {
          url: thumbnailUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      images: [thumbnailUrl],
    },
  };
}

const page = async ({ params }: ListDetailProps) => {
  const { id } = await params;
  const postId = postIdParamSchema.safeParse(id);

  if (!postId.success) notFound();

  const [postResult, isLoggedIn] = await Promise.all([
    getPostDetailOnServer(postId.data),
    hasValidToken(),
  ]);

  // 존재하지 않는 게시글은 200 soft 404 대신 실제 404로 응답한다.
  if (postResult.status === "notFound") notFound();

  return (
    <ClientDetail
      id={postId.data}
      isLoggedIn={isLoggedIn}
      initialPost={postResult.status === "found" ? postResult.post : undefined}
    />
  );
};

export default page;
