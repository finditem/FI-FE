import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { formatMetadataAddress } from "@/utils";
import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import ClientDetail from "./_components/ClientDetail/ClientDetail";

interface ListDetailProps {
  params: Promise<{ id: string }>;
}

const postIdParamSchema = z.coerce.number().int().positive();

export async function generateMetadata({ params }: ListDetailProps): Promise<Metadata> {
  const { id } = await params;
  const postId = postIdParamSchema.safeParse(id);

  if (!postId.success) return {};

  const post = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId.data}/share`, {
    next: { revalidate: 600 },
  }).then((res) => res.json());

  const postTypeLabel = post?.result?.postType === "LOST" ? "분실" : "발견";
  const address = formatMetadataAddress(post?.result?.address);

  const title = `${post?.result?.title ?? "물품"} | ${address} | 찾아줘! ${postTypeLabel}`;
  const description = post?.result?.summary ?? "리스트 상세";
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

  const isLoggedIn = await hasValidToken();

  return <ClientDetail id={postId.data} isLoggedIn={isLoggedIn} />;
};

export default page;
