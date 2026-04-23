import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { VWorldAddressItem } from "@/types";

interface VWorldSearchResponse {
  response: {
    /** API 응답 상태 */
    status: string;
    result?: {
      /** 검색 결과 주소 목록 */
      items: VWorldAddressItem[];
    };
    error?: {
      /** 오류 메시지 */
      text: string;
    };
  };
}

/**
 * VWorld 주소 검색 API를 사용하여 주소 자동완성 기능을 제공하는 커스텀 훅입니다.
 *
 * @remarks
 * - 검색어가 2자 미만이면 API를 호출하지 않습니다.
 * - 입력 후 `delay`(ms)만큼 디바운스 처리됩니다.
 * - 검색 결과는 5분간 캐싱됩니다.
 *
 * @param query - 검색어
 * @param delay - 디바운스 시간 (단위: ms, default: 300)
 *
 * @returns TanStack Query 결과 객체 (`data`: `VWorldAddressItem[]`)
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const { data, isLoading } = useVWorldAddressSearch("서울특별시");
 * ```
 */

const useVWorldAddressSearch = (query: string, delay = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  return useQuery({
    queryKey: ["vworldSearch", debouncedQuery],
    queryFn: async () => {
      const q = debouncedQuery.trim();
      if (q.length < 2) return [];

      const response = await fetch(`/api/vworld?query=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error("VWorld API request failed");
      }

      const data: VWorldSearchResponse = await response.json();

      if (data.response.status === "NOT_FOUND") return [];
      return data.response.result?.items || [];
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });
};

export default useVWorldAddressSearch;
