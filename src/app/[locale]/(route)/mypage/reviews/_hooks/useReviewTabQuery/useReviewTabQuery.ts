"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReviewTabType } from "../../_types/ReviewTabType";

const DEFAULT_TAB: ReviewTabType = "received";

const isReviewTabType = (value: string | null): value is ReviewTabType => {
  return value === "received" || value === "sent" || value === "hidden";
};

/**
 * 찾길 후기 탭 상태를 쿼리스트링(`?tab=`)과 동기화합니다.
 *
 * @remarks
 * - 값이 없거나 비정상이면 기본값 `received`로 폴백합니다.
 * - 기본값일 때는 쿼리에서 `tab`을 제거합니다.
 */
export const useReviewTabQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const tab: ReviewTabType = isReviewTabType(rawTab) ? rawTab : DEFAULT_TAB;

  const updateTabQuery = (nextTab: ReviewTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTab === DEFAULT_TAB) params.delete("tab");
    else params.set("tab", nextTab);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return { tab, updateTabQuery };
};
