import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface UseInfiniteScrollOptions {
  /** 다음 페이지를 요청할 때 호출합니다 (예: TanStack Query `fetchNextPage`). */
  fetchNextPage: () => void;
  /**
   * 다음 페이지 존재 여부. `true`일 때만 요청합니다.
   * `false`·`undefined`는 모두 “다음 없음”으로 보고 `fetchNextPage`를 호출하지 않습니다.
   */
  hasNextPage: boolean | undefined;
  /** 다음 페이지를 이미 가져오는 중이면 중복 호출을 막기 위해 `true`여야 합니다. */
  isFetchingNextPage: boolean;
  /** `react-intersection-observer`의 `useInView`에 그대로 넘깁니다 (예: `threshold`). */
  inViewOptions?: {
    threshold?: number;
  };
}

/**
 * 교차 관측 센티널이 뷰포트에 들어올 때 조건이 맞으면 `fetchNextPage`를 호출해 무한 스크롤을 이어 갑니다.
 *
 * 목록 하단에 빈 센티널 요소를 두고, 반환된 `ref`를 그 요소에 연결해 사용합니다.
 *
 * @param options - `fetchNextPage` / 페이지 존재 여부 / 로딩 플래그 / (선택) `useInView` 옵션
 *
 * @returns 센티널 DOM에 붙일 `ref`
 *
 * @remarks
 * - `inView && hasNextPage && !isFetchingNextPage`일 때만 `fetchNextPage`를 호출합니다.
 * - `hasNextPage`는 truthy일 때만 `true`로 간주합니다 (`undefined`는 요청하지 않음).
 * - `inViewOptions`를 생략하면 `useInView({ threshold: 0 })`과 동일한 기본값을 씁니다.
 *
 * @author hyungjun
 * /
 
/**
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(...);
 * const { ref } = useInfiniteScroll({
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * });
 *
 * return (
 *   <>
 *     {data?.map((item) => <Item key={item.id} {...item} />)}
 *     <div ref={ref} className="h-[100px]" aria-hidden />
 *   </>
 * );
 * ```
 */

export function useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  inViewOptions = { threshold: 0 },
}: UseInfiniteScrollOptions) {
  const { ref, inView } = useInView(inViewOptions);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref };
}
