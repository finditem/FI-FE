import { RegionRow } from "@/types";

/**
 * 지역 목록에서 검색어와 일치하는 지역을 필터링하는 유틸리티 함수입니다.
 *
 * @remarks
 * - `query`가 없거나 공백이면 빈 배열을 반환합니다.
 * - 대소문자를 구분하지 않고 `display` 필드 기준으로 부분 일치 검색합니다.
 *
 * @returns 검색어와 일치하는 지역 목록, 최대 `maxResults`개
 *
 * @author jikwon
 */

interface GetRegionSearchResultsParams {
  /** 전체 지역 목록 */
  regions: RegionRow[];
  /** 검색어 (null 또는 공백이면 빈 배열 반환) */
  query?: string | null;
  /** 반환할 최대 결과 개수 (default: 30) */
  maxResults?: number;
}

/**
 * @example
 * ```ts
 * const results = getRegionSearchResults({
 *   regions: regionList,
 *   query: "서울",
 *   maxResults: 10,
 * });
 * // 결과: display에 "서울"이 포함된 RegionRow 배열 (최대 10개)
 *
 * getRegionSearchResults({ regions: regionList, query: "" });
 * // 결과: []
 * ```
 */

export const getRegionSearchResults = ({
  regions,
  query,
  maxResults = 30,
}: GetRegionSearchResultsParams): RegionRow[] => {
  const q = (query ?? "").trim();
  if (!q) return [];

  const lowered = q.toLowerCase();

  const matched: RegionRow[] = [];
  for (let i = 0; i < regions.length; i += 1) {
    const r = regions[i];
    if (r.display.toLowerCase().includes(lowered)) {
      matched.push(r);
      if (matched.length >= maxResults) break;
    }
  }

  return matched;
};
