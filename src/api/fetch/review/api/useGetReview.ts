import type { AxiosError } from "axios";
import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ReviewDetailResponse } from "../types/ReviewDetailType";

/**
 * 후기 상세를 조회한다. 후기를 보낸 사용자나 받은 사용자만 조회할 수 있어 인증(auth)이 필요하며,
 * 당사자가 아니면 403(REVIEW403-ACCESS_DENIED), 없으면 404(REVIEW404-NOT_FOUND)가 내려온다.
 *
 * @example
 * ```ts
 * const { data, isLoading, isError } = useGetReview({ reviewId });
 * const review = data?.result;
 * ```
 */
export const useGetReview = ({ reviewId }: { reviewId: number }) =>
  useAppQuery<ApiBaseResponseType<ReviewDetailResponse>, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    ["review-detail", reviewId],
    `/reviews/${reviewId}`
  );
