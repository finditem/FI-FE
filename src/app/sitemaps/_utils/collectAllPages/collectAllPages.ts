/** 사이트맵 한 파일의 URL 상한(50,000)보다 여유 있게 둔 수집 상한입니다. */
const MAX_ENTRIES_PER_SITEMAP = 45000;
/** 목록 API를 한 번에 조회하는 건수입니다. */
const PAGE_SIZE = 100;

interface CursorPage<T> {
  items: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * cursor 기반 목록 API를 끝까지 순회해 사이트맵에 넣을 항목을 모읍니다.
 *
 * @remarks
 * - 한 파일 상한을 넘지 않도록 최대 45,000건까지만 모읍니다. 이 상한에 가까워지면 해당 종류의
 *   사이트맵을 다시 여러 파일로 나눠야 합니다.
 * - 조회가 실패하면 그때까지 모은 항목만 돌려주고 로그를 남깁니다. 사이트맵 전체가 깨지지 않게 하기 위함입니다.
 *
 * @param buildUrl - 쿼리스트링(`size`, `cursor`)을 받아 요청 주소를 만드는 함수
 * @param toPage - 응답 본문을 항목 목록과 다음 cursor로 바꾸는 함수
 *
 * @author suhyeon
 */
/**
 * @example
 * ```ts
 * const posts = await collectAllPages<PostItem>(
 *   (query) => `${apiUrl}/posts/search?${query}`,
 *   (data) => ({ items: data.result.postList, nextCursor: data.result.nextCursor, hasNext: data.result.hasNext })
 * );
 * ```
 */
export const collectAllPages = async <T>(
  buildUrl: (query: string) => string,
  // 백엔드 목록 응답 래퍼가 도메인마다 달라 호출부에서 변환한다.
  toPage: (data: any) => CursorPage<T>
): Promise<T[]> => {
  const collected: T[] = [];
  let cursor: number | undefined;

  try {
    while (collected.length < MAX_ENTRIES_PER_SITEMAP) {
      const query = `size=${PAGE_SIZE}${cursor === undefined ? "" : `&cursor=${cursor}`}`;
      const res = await fetch(buildUrl(query), { next: { revalidate: 3600 } });
      const data = await res.json();
      if (!data?.isSuccess) throw new Error(data?.code ?? `HTTP ${res.status}`);

      const page = toPage(data);
      collected.push(...page.items);
      if (!page.hasNext || page.nextCursor == null || page.nextCursor === cursor) break;
      cursor = page.nextCursor;
    }
  } catch (error) {
    console.error(`sitemap collection failed: ${buildUrl("")}`, error);
  }

  return collected.slice(0, MAX_ENTRIES_PER_SITEMAP);
};
