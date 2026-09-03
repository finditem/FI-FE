import { cn } from "@/utils";

const BLOCK = "bg-labelsVibrant-quaternary skeleton-animation";

interface NeighborhoodPlaceCardSkeletonProps {
  /** 렌더링할 스켈레톤 행 수 (default: 3) */
  count?: number;
}

/** 동네 구경 섹션 로딩 중 표시하는 카드 스켈레톤 목록입니다. */
const NeighborhoodPlaceCardSkeleton = ({ count = 3 }: NeighborhoodPlaceCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 py-4">
          <div className={cn(BLOCK, "size-[100px] shrink-0 rounded-2xl")} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className={cn(BLOCK, "h-[18px] w-2/3 rounded-sm")} />
              <div className={cn(BLOCK, "h-[13px] w-1/2 rounded-sm")} />
              <div className={cn(BLOCK, "h-[13px] w-2/5 rounded-sm")} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn(BLOCK, "h-5 w-[43px] rounded-full")} />
              <div className={cn(BLOCK, "h-[13px] w-[90px] rounded-sm")} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NeighborhoodPlaceCardSkeleton;
