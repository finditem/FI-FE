"use client";

import { Tab } from "@/components";
import { useTranslations } from "next-intl";
import { useReviewTabQuery } from "../../_hooks/useReviewTabQuery/useReviewTabQuery";
import ReviewsContent from "../ReviewsContent/ReviewsContent";

/**
 * 찾길 후기 탭(받은/보낸/숨긴 후기)과 선택된 탭의 콘텐츠를 렌더합니다.
 *
 * @remarks
 * - 탭 선택 상태는 쿼리스트링(`?tab=`)과 동기화합니다(`useReviewTabQuery`).
 */
const ReviewsContainer = () => {
  const t = useTranslations("MypageReviewsPage");
  const { tab, updateTabQuery } = useReviewTabQuery();

  const tabs = [
    { key: "received", label: t("tabs.received") },
    { key: "sent", label: t("tabs.sent") },
    { key: "hidden", label: t("tabs.hidden") },
  ] as const;

  return (
    <div className="h-base">
      <Tab
        tabs={tabs}
        selected={tab}
        onValueChange={updateTabQuery}
        aria-label={t("tabsAriaLabel")}
      />

      <ReviewsContent selectedTab={tab} />
    </div>
  );
};

export default ReviewsContainer;
