import type { MetadataRoute } from "next";
import type { NoticeItem } from "@/api/fetch/notice/types/NoticesType";
import { buildLocalizedEntry } from "../_utils/buildLocalizedEntry/buildLocalizedEntry";
import { collectAllPages } from "../_utils/collectAllPages/collectAllPages";

/** 공지사항 전체 사이트맵입니다. `/sitemap.xml` 인덱스에 포함됩니다. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.finditem.kr";

  const notices = await collectAllPages<NoticeItem>(
    (query) => `${apiUrl}/notices?${query}`,
    (data) => ({
      items: data.result?.content ?? [],
      nextCursor: data.result?.nextCursor ?? null,
      hasNext: Boolean(data.result?.hasNext),
    })
  );

  return notices.map((notice) =>
    buildLocalizedEntry(`/notice/${notice.noticeId}`, {
      ...(notice.createdAt && { lastModified: new Date(notice.createdAt) }),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );
}
