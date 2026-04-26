import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { applyFiltersToUrl } from "@/utils";

/**
 * URL 쿼리 파라미터와 React 상태를 동기화하여 필터 로직을 관리하는 커스텀 훅입니다.
 *
 * @remarks
 * - Next.js App Router의 `useRouter`, `usePathname` 등을 활용하여 URL 쿼리스트링을 제어합니다.
 * - 필터 상태가 변경되면 자동으로 URL을 업데이트(`router.replace`)하여 공유 가능한 링크를 생성합니다.
 * - 브라우저의 '뒤로 가기'나 직접적인 URL 변경 시에도 `currentFiltersFromUrl`을 통해 내부 상태를 최신화합니다.
 * - `applyFiltersToUrl` 유틸을 사용하여 복잡한 객체 상태를 쿼리스트링으로 변환합니다.
 *
 * @template T - 필터 상태 객체의 타입 (Object)
 *
 * @returns 필터 상태 및 URL 동기화 핸들러 객체
 * - `filters`: 현재 동기화된 필터 상태 객체
 * - `setFilters`: 필터 상태를 직접 조작하는 React State Setter
 * - `updateFilters`: 부분적 필터 업데이트와 함께 URL 쿼리스트링을 즉시 갱신하는 함수
 *
 * @author suhyeon
 */

interface UseFilterSyncProps<T extends object> {
  /** 필터의 초기/기본값 설정 객체 */
  defaultFilters: T;
  /** URL 파라미터에서 추출하여 현재 적용된 필터 값 */
  currentFiltersFromUrl: Partial<T>;
}

/**
 * @example
 * ```ts
 * // 1. URL 파라미터 추출 (별도 커스텀 훅 가정)
 * const { startDate, endDate, sort } = useFilterParams();
 *
 * // 2. 필터 동기화 훅 사용
 * const { filters, updateFilters } = useFilterSync({
 * defaultFilters: { startDate: "", endDate: "", sort: "LATEST" },
 * currentFiltersFromUrl: { startDate, endDate, sort },
 * });
 *
 * // 3. 필터 업데이트 시 (URL이 자동으로 ?sort=OLDEST 등으로 변경됨)
 * const handleSortChange = (newSort: string) => {
 * updateFilters({ sort: newSort });
 * };
 * ```
 */

export const useFilterSync = <T extends object>({
  defaultFilters,
  currentFiltersFromUrl,
}: UseFilterSyncProps<T>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<T>({
    ...defaultFilters,
    ...currentFiltersFromUrl,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...currentFiltersFromUrl,
    }));
  }, [currentFiltersFromUrl]);

  const updateFilters = useCallback(
    (nextFilters: Partial<T>) => {
      const updated = { ...filters, ...nextFilters };
      setFilters(updated);

      const qs = applyFiltersToUrl({
        filters: updated,
        searchParams: new URLSearchParams(searchParams.toString()),
      });

      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [filters, pathname, router, searchParams]
  );

  return { filters, setFilters, updateFilters };
};
