import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import useServerPrefetchQuery from "@/api/_base/query/useServerPrefetchQuery";
import { GetDetailPostResponse } from "@/api/fetch/post/types/PostDetailType";
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

  // 상세 본문을 서버에서 미리 가져와 초기 HTML에 싣고, 클라이언트 훅과 같은 query key로 캐시를 재사용한다.
  const queryClient = new QueryClient();
  await useServerPrefetchQuery<GetDetailPostResponse>({
    queryClient,
    queryKey: ["post-detail", postId.data],
    fetcher: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId.data}`, {
        next: { revalidate: 60 },
      }).then((res) => {
        if (!res.ok) throw new Error(`게시글 ${postId.data} 조회에 실패했습니다.`);
        return res.json();
      }),
  });

  // 존재하지 않는 게시글은 200 soft 404 대신 실제 404로 응답한다.
  const prefetched = queryClient.getQueryData<GetDetailPostResponse>(["post-detail", postId.data]);
  if (!prefetched?.result) notFound();

  const isLoggedIn = await hasValidToken();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientDetail id={postId.data} isLoggedIn={isLoggedIn} initialPost={prefetched} />
    </HydrationBoundary>
  );
};

export default page;
