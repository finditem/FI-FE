import { MetadataRoute } from "next";
import { PostItem } from "@/api/fetch/post/types/PostItemType";
import { NoticeItem } from "@/api/fetch/notice/types/NoticesType";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

const buildLocalizedEntry = (
  baseUrl: string,
  href: string,
  rest: Pick<MetadataRoute.Sitemap[number], "lastModified" | "changeFrequency" | "priority">
): MetadataRoute.Sitemap[number] => ({
  url: `${baseUrl}${getPathname({ locale: routing.defaultLocale, href })}`,
  ...rest,
  alternates: {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${baseUrl}${getPathname({ locale, href })}`])
    ),
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.finditem.kr";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.finditem.kr";

  // 기본 정적 라우트
  const routes = ["", "/list", "/hello", "/notice", "/public-data"].map((route) =>
    buildLocalizedEntry(baseUrl, route, {
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    })
  );

  // 공공데이터, 일반 리스트 타입별 라우트
  const listTypes = ["found", "lost"].flatMap((type) => [
    buildLocalizedEntry(baseUrl, `/list?type=${type}`, {
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 0.8,
    }),
    buildLocalizedEntry(baseUrl, `/public-data?type=${type}`, {
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 0.8,
    }),
  ]);

  // 동적 일반 게시글 (최신 100개)
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const postsRes = await fetch(`${apiUrl}/posts/search?size=100`, {
      next: { revalidate: 3600 },
    });
    const postsData = await postsRes.json();

    if (postsData?.isSuccess && postsData?.result?.postList) {
      postRoutes = postsData.result.postList.map((post: PostItem) =>
        buildLocalizedEntry(baseUrl, `/list/${post.id}`, {
          lastModified: new Date(post.createdAt),
          changeFrequency: "daily" as const,
          priority: 0.6,
        })
      );
    }
  } catch (error) {
    console.error("게시글 sitemap 생성 실패:", error);
  }

  // 동적 공지사항 (최신 20개)
  let noticeRoutes: MetadataRoute.Sitemap = [];
  try {
    const noticesRes = await fetch(`${apiUrl}/notices?size=20`, {
      next: { revalidate: 3600 },
    });
    const noticesData = await noticesRes.json();

    if (noticesData?.isSuccess && noticesData?.result?.content) {
      noticeRoutes = noticesData.result.content.map((notice: NoticeItem) =>
        buildLocalizedEntry(baseUrl, `/notice/${notice.noticeId}`, {
          lastModified: new Date(notice.createdAt || new Date()),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })
      );
    }
  } catch (error) {
    console.error("공지사항 sitemap 생성 실패:", error);
  }

  return [...routes, ...listTypes, ...postRoutes, ...noticeRoutes];
}
