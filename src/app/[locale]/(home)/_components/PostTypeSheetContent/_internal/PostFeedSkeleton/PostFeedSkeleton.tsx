import { cn } from "@/utils";

const BLOCK = "bg-labelsVibrant-quaternary skeleton-animation";

interface PostFeedSkeletonProps {
  /** 렌더링할 스켈레톤 행 수 (default: 4) */
  count?: number;
}

/** 분실물/발견물 피드 로딩 중 표시하는 게시글 목록 스켈레톤입니다. `<ul>` 안에서 사용합니다. */
const PostFeedSkeleton = ({ count = 4 }: PostFeedSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="flex items-center gap-[14px] border-b border-b-flatGray-50 px-5 py-[30px]"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex gap-2">
              <div className={cn(BLOCK, "h-[22px] w-12 rounded-full")} />
              <div className={cn(BLOCK, "h-[22px] w-14 rounded-full")} />
            </div>
            <div className={cn(BLOCK, "h-[18px] w-2/3 rounded-sm")} />
            <div className={cn(BLOCK, "h-[14px] w-1/2 rounded-sm")} />
            <div className={cn(BLOCK, "h-[14px] w-4/5 rounded-sm")} />
            <div className="flex gap-2 pt-1">
              <div className={cn(BLOCK, "h-[14px] w-10 rounded-sm")} />
              <div className={cn(BLOCK, "h-[14px] w-10 rounded-sm")} />
            </div>
          </div>
          <div className={cn(BLOCK, "size-[90px] shrink-0 rounded-2xl")} />
        </li>
      ))}
    </>
  );
};

export default PostFeedSkeleton;
