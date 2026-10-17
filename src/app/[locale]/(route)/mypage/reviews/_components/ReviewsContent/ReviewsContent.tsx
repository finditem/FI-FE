"use client";

import { useEffect, useState } from "react";
import { EmptyState, ReviewCard } from "@/components";
import { MOCK_RECEIVED_REVIEWS } from "@/mock/data";
import { useTranslations } from "next-intl";
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
 * - 받은 후기는 리스트(카드) 상태까지 퍼블리싱되었습니다. API 연동 전까지는 더미 데이터를 씁니다.
 * - 보낸 후기는 아직 빈 상태만 퍼블리싱 범위입니다.
 * - 숨긴 후기는 빈 상태까지 퍼블리싱되었습니다.
 */
const ReviewsContent = ({ selectedTab }: ReviewsContentProps) => {
  const t = useTranslations("MypageReviewsPage");

  // 모든 탭은 진입 시 로딩 스켈레톤을 먼저 보여준 뒤 콘텐츠를 렌더한다. 실제 후기 목록은 세 탭 모두
  // 클라이언트에서 비동기로 패칭될 예정이라 로딩 → 콘텐츠 흐름이 자연스럽다. 또한 받은 후기 더미
  // 데이터의 createdAt이 모듈 로드 시점 기준 상대 시각이라, 마운트 전(SSR/첫 렌더)에 카드를 그리면
  // 서버와 클라이언트 값이 어긋나 하이드레이션 에러가 나는데, 이 마운트 게이트가 그것도 함께 막는다.
  // TODO(수현): 각 탭 API 연동 시 이 마운트 게이트를 쿼리의 isLoading으로 대체하고
  // MOCK_RECEIVED_REVIEWS를 실제 데이터로 교체.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <ReviewListSkeleton />;

  if (selectedTab === "received") {
    if (MOCK_RECEIVED_REVIEWS.length === 0) {
      return (
        <EmptyState
          icon={{ iconName: "ReceiveReview", iconSize: 90 }}
          title={t("empty.receivedTitle")}
          description={t("empty.receivedDescription")}
        />
      );
    }

    return (
      <section>
        <h2 className="flex items-center gap-1 px-5 pb-2 pt-[26px] text-body1-semibold text-layout-header-default">
          {t("countLabel")}
          <span>{MOCK_RECEIVED_REVIEWS.length}</span>
        </h2>
        <ul>
          {MOCK_RECEIVED_REVIEWS.map((review) => (
            <ReviewCard key={review.id} data={review} />
          ))}
        </ul>
      </section>
    );
  }

  if (selectedTab === "sent") {
    return (
      <EmptyState
        icon={{ iconName: "SendReview", iconSize: 90 }}
        title={t("empty.sentTitle")}
        description={t("empty.sentDescription")}
      />
    );
  }

  return (
    <EmptyState
      icon={{ iconName: "HiddenReview", iconSize: 70 }}
      title={t("empty.hiddenTitle")}
      description={t("empty.hiddenDescription")}
    />
  );
};

export default ReviewsContent;
