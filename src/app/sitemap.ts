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
    languages: {
      ...Object.fromEntries(
        routing.locales.map((locale) => [locale, `${baseUrl}${getPathname({ locale, href })}`])
      ),
      "x-default": `${baseUrl}${getPathname({ locale: routing.defaultLocale, href })}`,
    },
  },
});

/** 사이트맵 한 파일의 URL 상한(50,000)보다 여유 있게 둔 수집 상한입니다. 넘으면 generateSitemaps로 분할해야 합니다. */
const MAX_DYNAMIC_ENTRIES = 45000;
/** 목록 API를 한 번에 조회하는 건수입니다. */
const PAGE_SIZE = 100;

interface CursorPage<T> {
  items: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * cursor 기반 목록 API를 끝까지 순회해 항목을 모읍니다. 실패하면 그때까지 모은 항목만 돌려줍니다.
 *
 * @param fetchPage - cursor를 받아 한 페이지를 돌려주는 함수 (첫 페이지는 `undefined`)
 * @param label - 실패 로그에 남길 대상 이름
 */
const collectAllPages = async <T>(
  fetchPage: (cursor: number | undefined) => Promise<CursorPage<T>>,
  label: string
): Promise<T[]> => {
  const collected: T[] = [];
  let cursor: number | undefined;

  try {
    while (collected.length < MAX_DYNAMIC_ENTRIES) {
      const page = await fetchPage(cursor);
      collected.push(...page.items);
      if (!page.hasNext || page.nextCursor == null || page.nextCursor === cursor) break;
      cursor = page.nextCursor;
    }
  } catch (error) {
    console.error(`${label} sitemap 생성 실패:`, error);
  }

  return collected.slice(0, MAX_DYNAMIC_ENTRIES);
};

const buildCursorQuery = (cursor: number | undefined) =>
  `size=${PAGE_SIZE}${cursor === undefined ? "" : `&cursor=${cursor}`}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.finditem.kr";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.finditem.kr";

  // 정적 라우트는 실제 수정 시각을 알 수 없어 lastModified를 넣지 않는다. 매 요청 시각을 넣으면
  // 검색엔진이 lastmod 값을 신뢰하지 않게 된다.
  // 홈은 ""가 아니라 "/"로 넘겨야 getPathname이 en 접두사를 붙여 대체 링크가 /en을 가리킨다.
  // /list?type= 같은 쿼리 변형은 canonical이 /list로 모이므로 사이트맵에 넣지 않는다.
  const routes = ["/", "/list", "/public-data", "/notice", "/hello"].map((route) =>
    buildLocalizedEntry(baseUrl, route, {
      changeFrequency: "daily" as const,
      priority: route === "/" ? 1.0 : 0.8,
    })
  );

  // 일반 게시글 전체 (cursor 순회)
  const posts = await collectAllPages<PostItem>(async (cursor) => {
    const res = await fetch(`${apiUrl}/posts/search?${buildCursorQuery(cursor)}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (!data?.isSuccess) throw new Error(data?.code ?? `HTTP ${res.status}`);
    return {
      items: data.result?.postList ?? [],
      nextCursor: data.result?.nextCursor ?? null,
      hasNext: Boolean(data.result?.hasNext),
    };
  }, "posts");

  // TODO(수현): 백엔드가 목록 응답에 updatedAt을 내려주면 lastModified를 수정 시각으로 바꾼다.
  const postRoutes = posts.map((post) =>
    buildLocalizedEntry(baseUrl, `/list/${post.id}`, {
      lastModified: new Date(post.createdAt),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })
  );

  // 공지사항 전체 (cursor 순회)
  const notices = await collectAllPages<NoticeItem>(async (cursor) => {
    const res = await fetch(`${apiUrl}/notices?${buildCursorQuery(cursor)}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (!data?.isSuccess) throw new Error(data?.code ?? `HTTP ${res.status}`);
    return {
      items: data.result?.content ?? [],
      nextCursor: data.result?.nextCursor ?? null,
      hasNext: Boolean(data.result?.hasNext),
    };
  }, "notices");

  const noticeRoutes = notices.map((notice) =>
    buildLocalizedEntry(baseUrl, `/notice/${notice.noticeId}`, {
      ...(notice.createdAt && { lastModified: new Date(notice.createdAt) }),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...routes, ...postRoutes, ...noticeRoutes];
}
