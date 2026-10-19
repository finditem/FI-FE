"use client";

import { useEffect, useState } from "react";
import { useGetMyReviews, type ReviewHelpType, type ReviewListItem } from "@/api/fetch/review";
import { EmptyState, LoadingState, ReviewCard } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { useTranslations } from "next-intl";
import type { ReviewCardData } from "@/types";
import type { ReviewTabType } from "../../_types/ReviewTabType";
import ReviewListSkeleton from "../_internal/ReviewListSkeleton/ReviewListSkeleton";

interface ReviewsContentProps {
  /** 현재 선택된 탭 */
  selectedTab: ReviewTabType;
}

/**
 * 선택된 탭에 해당하는 후기 콘텐츠를 렌더합니다.
 *
 * @remarks
 * - 받은 후기와 보낸 후기는 선택한 탭에 맞는 API 목록을 렌더합니다.
 * - 커서 기반 다음 페이지가 있으면 하단 센티널에서 이어서 조회합니다.
 */
const ReviewsContent = ({ selectedTab }: ReviewsContentProps) => {
  const t = useTranslations("MypageReviewsPage");
  const { addToast } = useToast();
  const [hiddenReviewIds, setHiddenReviewIds] = useState<number[]>([]);
  const reviewType = selectedTab === "received" ? "RECEIVED" : "SENT";
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyReviews({ type: reviewType });
  const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  useEffect(() => {
    if (isError) addToast(t("loadError"), "error");
  }, [addToast, isError, t]);

  if (selectedTab === "hidden") {
    return (
      <EmptyState
        icon={{ iconName: "HiddenReview", iconSize: 70 }}
        title={t("empty.hiddenTitle")}
        description={t("empty.hiddenDescription")}
      />
    );
  }

  if (isLoading) return <ReviewListSkeleton />;

  const reviews = (data?.reviewList ?? []).filter(
    (review) => !hiddenReviewIds.includes(review.reviewId)
  );

  if (reviews.length === 0) {
    const isReceived = selectedTab === "received";
    return (
      <EmptyState
        icon={{ iconName: isReceived ? "ReceiveReview" : "SendReview", iconSize: 90 }}
        title={t(isReceived ? "empty.receivedTitle" : "empty.sentTitle")}
        description={t(isReceived ? "empty.receivedDescription" : "empty.sentDescription")}
      />
    );
  }

  const getHelpTypeLabel = (helpType: ReviewHelpType) => {
    const labelKeys = {
      KIND_AND_WARM: "helpItems.kind",
      TRUSTWORTHY_COMMUNICATION: "helpItems.trustworthy",
      QUICK_RESPONSE: "helpItems.quickResponse",
      SAFE_STORAGE: "helpItems.safeKeeping",
      USEFUL_INFORMATION: "helpItems.helpfulInfo",
    } as const;

    return t(labelKeys[helpType]);
  };

  const toReviewCardData = (review: ReviewListItem): ReviewCardData => ({
    id: review.reviewId,
    avatarUrl: review.user.profileImageUrl,
    nickname: review.user.nickname ?? t("withdrawnUser"),
    createdAt: review.createdAt,
    content: review.content,
    tagLabel: getHelpTypeLabel(review.helpTypes[0]),
    extraTagCount: Math.max(review.helpTypes.length - 1, 0),
  });

  return (
    <section>
      <h2 className="flex items-center gap-1 px-5 pb-2 pt-[26px] text-body1-semibold text-layout-header-default">
        {t("countLabel")}
        <span>{data?.reviewCount ?? reviews.length}</span>
      </h2>
      <ul>
        {reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            data={toReviewCardData(review)}
            showHideMenu={selectedTab === "received"}
            onHidden={(reviewId) => setHiddenReviewIds((ids) => [...ids, reviewId])}
          />
        ))}
      </ul>
      {hasNextPage && <div ref={ref} className="h-10 w-full" />}
      {isFetchingNextPage && <LoadingState />}
    </section>
  );
};

export default ReviewsContent;
