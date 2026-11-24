import type { MetadataRoute } from "next";
import type { PostItem } from "@/api/fetch/post/types/PostItemType";
import { buildLocalizedEntry } from "../_utils/buildLocalizedEntry/buildLocalizedEntry";
import { collectAllPages } from "../_utils/collectAllPages/collectAllPages";

/** 일반 게시글 전체 사이트맵입니다. `/sitemap.xml` 인덱스에 포함됩니다. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.finditem.kr";

  const posts = await collectAllPages<PostItem>(
    (query) => `${apiUrl}/posts/search?${query}`,
    (data) => ({
      items: data.result?.postList ?? [],
      nextCursor: data.result?.nextCursor ?? null,
      hasNext: Boolean(data.result?.hasNext),
    })
  );

  // 목록 응답에 수정 시각이 없어 작성 시각을 쓴다.
  return posts.map((post) =>
    buildLocalizedEntry(`/list/${post.id}`, {
      lastModified: new Date(post.createdAt),
      changeFrequency: "daily",
      priority: 0.6,
    })
  );
}
