"use client";

import { EmptyState } from "@/components";
import { useTranslations } from "next-intl";
import type { ReviewTabType } from "../../_types/ReviewTabType";

interface ReviewsContentProps {
  /** 현재 선택된 탭 */
  selectedTab: ReviewTabType;
}

/**
 * 선택된 탭에 해당하는 후기 콘텐츠를 렌더합니다.
 *
 * @remarks
 * - 현재는 빈 상태 퍼블리싱 범위입니다. 후기 리스트 카드와 API 연동은 추후 작업입니다.
 * - 숨긴 후기 탭은 빈 상태 디자인이 확정되지 않아 콘텐츠를 비워 둡니다.
 */
const ReviewsContent = ({ selectedTab }: ReviewsContentProps) => {
  const t = useTranslations("MypageReviewsPage");

  // TODO(suhyeon): 후기 리스트 카드와 API 연동 추가
  if (selectedTab === "received") {
    return (
      <EmptyState
        icon={{ iconName: "ReceiveReview", iconSize: 90 }}
        title={t("empty.receivedTitle")}
        description={t("empty.receivedDescription")}
      />
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

  // TODO(suhyeon): 숨긴 후기 빈 상태 디자인 확정 시 EmptyState 추가
  return null;
};

export default ReviewsContent;
