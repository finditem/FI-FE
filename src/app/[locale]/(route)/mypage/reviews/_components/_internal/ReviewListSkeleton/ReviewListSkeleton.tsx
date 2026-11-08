import { cn } from "@/utils";

const SKELETON_STYLE = "bg-labelsVibrant-quaternary skeleton-animation";

const ReviewCardSkeletonItem = () => {
  return (
    <li className="w-full px-5 py-[30px]">
      <div className="flex items-center gap-2">
        <div className={cn(SKELETON_STYLE, "size-[60px] rounded-full")} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className={cn(SKELETON_STYLE, "h-5 w-[87px] rounded-md")} />
          <div className={cn(SKELETON_STYLE, "h-4 w-[140px] rounded-md")} />
        </div>
      </div>

      <div className={cn(SKELETON_STYLE, "mt-3 h-10 w-full rounded-[10px]")} />

      <div className="mt-3 flex items-center gap-1">
        <div className={cn(SKELETON_STYLE, "h-6 w-[183px] rounded-full")} />
        <div className={cn(SKELETON_STYLE, "h-6 w-[30px] rounded-full")} />
      </div>
    </li>
  );
};

interface ReviewListSkeletonProps {
  /** 렌더링할 스켈레톤 카드 수 (default: 2) */
  count?: number;
}

/** 받은 후기 리스트 로딩 중 표시하는 "후기 N" 카운트 라벨 + 후기 카드 목록 스켈레톤입니다. */
const ReviewListSkeleton = ({ count = 2 }: ReviewListSkeletonProps) => {
  return (
    <section>
      <div className="px-5 pb-2 pt-[26px]">
        <div className="flex h-6 items-center">
          <div className={cn(SKELETON_STYLE, "h-4 w-[42px] rounded-md")} />
        </div>
      </div>
      <ul>
        {Array.from({ length: count }).map((_, index) => (
          <ReviewCardSkeletonItem key={index} />
        ))}
      </ul>
    </section>
  );
};

export default ReviewListSkeleton;
