import { cn } from "@/utils";

// 카드(흰 배경) 위 스켈레톤은 앱 공통 컨벤션(회색 + shimmer)을 따른다.
const CARD_SKELETON = "bg-labelsVibrant-quaternary skeleton-animation";
// 히어로(초록 배경) 위 스켈레톤은 Figma 시안대로 밝은 초록 솔리드를 쓴다. 공통 shimmer는 배경색을
// 회색으로 덮어써 초록 위에서 어색해지므로 적용하지 않는다.
const HERO_SKELETON = "bg-[#74dcb5]";

/**
 * 후기 편지 상세 페이지 로딩 중 표시하는 전체 화면 스켈레톤입니다.
 *
 * @remarks
 * - 초록 배경과 뒤로가기 헤더는 상위 `layout.tsx`가 유지하므로, 이 컴포넌트는 그 안에 들어가는
 *   히어로 + 후기 카드 + 하단 CTA 자리를 실제 레이아웃과 동일한 치수로 대체합니다.
 * - `page.tsx`가 스트리밍되는 동안 `loading.tsx`의 fallback으로 렌더됩니다.
 */
const ReviewDetailSkeleton = () => {
  return (
    <>
      {/* 히어로: 받은 후기 칩 + 도착 메시지 + 감정 캐릭터 자리 */}
      <section className={cn("overflow-hidden px-5 pb-7 pt-2", "tablet:px-16")}>
        <div className="flex items-start justify-between gap-4">
          <div className={cn("flex min-w-0 flex-1 flex-col items-start gap-2", "tablet:max-w-xs")}>
            <div className={cn(HERO_SKELETON, "h-6 w-[56px] rounded-full")} />
            <div className={cn(HERO_SKELETON, "h-5 w-[84px] rounded-md")} />
            <div className={cn(HERO_SKELETON, "h-5 w-[120px] rounded-md")} />
            <div className={cn(HERO_SKELETON, "h-5 w-[120px] rounded-md")} />
          </div>
          <div className={cn(HERO_SKELETON, "size-[170px] shrink-0 rounded-full")} />
        </div>
      </section>

      {/* 후기 카드: 프로필 + 편지 본문 + 장점 + 찾아준 물건 자리 */}
      <div
        className={cn(
          "relative z-10 mx-5 -mt-[38px] mb-6 flex flex-col gap-8 rounded-2xl bg-white px-4 py-6 shadow-md",
          "tablet:mx-auto tablet:max-w-2xl tablet:px-8"
        )}
      >
        <div className="flex flex-col gap-6">
          {/* 프로필 */}
          <div className="flex items-center gap-2">
            <div className={cn(CARD_SKELETON, "size-[60px] shrink-0 rounded-full")} />
            <div className="flex flex-col gap-1">
              <div className={cn(CARD_SKELETON, "h-5 w-[87px] rounded-md")} />
              <div className={cn(CARD_SKELETON, "h-4 w-[140px] rounded-md")} />
            </div>
          </div>

          {/* 편지 본문 */}
          <div className={cn(CARD_SKELETON, "h-[220px] w-full rounded-xl")} />

          {/* 장점 목록 */}
          <div className="flex flex-col gap-3">
            <div className={cn(CARD_SKELETON, "h-4 w-[140px] rounded-md")} />
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2">
                <div className={cn(CARD_SKELETON, "size-5 shrink-0 rounded-full")} />
                <div className={cn(CARD_SKELETON, "h-5 w-[206px] max-w-full rounded-md")} />
              </li>
              <li className="flex items-center gap-2">
                <div className={cn(CARD_SKELETON, "size-5 shrink-0 rounded-full")} />
                <div className={cn(CARD_SKELETON, "h-5 w-[155px] max-w-full rounded-md")} />
              </li>
              <li className="flex items-center gap-2">
                <div className={cn(CARD_SKELETON, "size-5 shrink-0 rounded-full")} />
                <div className={cn(CARD_SKELETON, "h-5 w-[288px] max-w-full rounded-md")} />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-labelsVibrant-quaternary" />

        {/* 찾아준 물건 */}
        <div className="flex flex-col gap-3">
          <div className={cn(CARD_SKELETON, "h-4 w-[69px] rounded-md")} />
          <div className="flex items-center gap-4">
            <div className={cn(CARD_SKELETON, "size-18 shrink-0 rounded-2xl")} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className={cn(CARD_SKELETON, "h-5 w-[213px] max-w-full rounded-md")} />
              <div className={cn(CARD_SKELETON, "h-4 w-[139px] max-w-full rounded-md")} />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 CTA 버튼 자리 */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[764px] border-t border-labelsVibrant-quaternary bg-white px-4 pb-[calc(32px+var(--safe-area-bottom))] pt-3">
        <div className={cn(CARD_SKELETON, "h-12 w-full rounded-[10px]")} />
      </div>
    </>
  );
};

export default ReviewDetailSkeleton;
