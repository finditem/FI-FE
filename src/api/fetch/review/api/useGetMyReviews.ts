import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useAuthStore } from "@/store";
import type { InfiniteData } from "@tanstack/react-query";
import type { ReviewListItem, ReviewListResponse, ReviewListType } from "../types/ReviewListType";

interface UseGetMyReviewsParams {
  type: ReviewListType;
  size?: number;
}

export interface MyReviewsData {
  reviewList: ReviewListItem[];
  reviewCount: number;
}

/**
 * 현재 사용자가 받은 후기 또는 보낸 후기를 최신순으로 조회합니다.
 *
 * @param params - 후기 구분과 페이지당 조회 개수입니다.
 *
 * @example
 * const reviewsQuery = useGetMyReviews({ type: "RECEIVED" });
 */
export const useGetMyReviews = ({ type, size = 10 }: UseGetMyReviewsParams) => {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const queryParams = new URLSearchParams({ type, size: String(size) });

  return useAppInfiniteQuery<ReviewListResponse, ApiBaseResponseType<null>, MyReviewsData>(
    "auth",
    ["/users/me/reviews", type, size],
    `/users/me/reviews?${queryParams}`,
    {
      enabled: isAuthInitialized,
      getNextPageParam: (lastPage) =>
        lastPage.result.hasNext ? (lastPage.result.nextCursor ?? undefined) : undefined,
      select: (data: InfiniteData<ReviewListResponse>) => ({
        reviewList: data.pages.flatMap((page) => page.result.reviewList),
        reviewCount: data.pages[0]?.result.reviewCount ?? 0,
      }),
    }
  );
};
