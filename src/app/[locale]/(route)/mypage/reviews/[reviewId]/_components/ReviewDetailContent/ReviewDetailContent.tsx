"use client";

import { notFound } from "next/navigation";
import { useGetReview } from "@/api/fetch/review";
import { ErrorState } from "@/components";
import ReviewDetailHero from "../ReviewDetailHero/ReviewDetailHero";
import ReviewLetterDetail from "../ReviewLetterDetail/ReviewLetterDetail";
import ReviewDetailSkeleton from "../_internal/ReviewDetailSkeleton/ReviewDetailSkeleton";

interface ReviewDetailContentProps {
  reviewId: number;
}

/**
 * 후기 상세를 조회해 히어로와 편지 카드에 데이터를 내려주는 클라이언트 컨테이너입니다.
 *
 * @remarks
 * - 인증이 필요한 조회라 이 레포의 공통 패턴대로 클라이언트에서 `useGetReview`로 가져옵니다.
 * - 로딩 중에는 `ReviewDetailSkeleton`(route `loading.tsx`와 동일한 전체 화면 스켈레톤)을 렌더합니다.
 * - 당사자가 아니거나(403) 없는 후기(404)면 `notFound()`로 가까운 not-found 경계를 띄웁니다.
 *
 * @author suhyeon
 */
const ReviewDetailContent = ({ reviewId }: ReviewDetailContentProps) => {
  const { data, isLoading, isError, error } = useGetReview({ reviewId });

  if (isLoading) return <ReviewDetailSkeleton />;

  const review = data?.result;
  const errorStatus = error?.response?.status;
  if (isError && (errorStatus === 403 || errorStatus === 404)) return notFound();
  if (isError || !review) return <ErrorState icon={{}} />;

  return (
    <>
      <ReviewDetailHero review={review} />
      <ReviewLetterDetail review={review} />
    </>
  );
};

export default ReviewDetailContent;
