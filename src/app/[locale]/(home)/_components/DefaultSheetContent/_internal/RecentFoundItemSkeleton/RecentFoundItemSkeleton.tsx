import { cn } from "@/utils";

const SKELETON_STYLE = "bg-labelsVibrant-quaternary skeleton-animation";

const RecentFoundItemSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="relative rounded-2xl shadow-[0px_1px_1px_rgba(0,0,0,0.08)]">
          <div className={cn(SKELETON_STYLE, "h-[142px] w-[136px] rounded-2xl")} />
          <div className="absolute bottom-0 right-0 flex w-full flex-col gap-1.5 rounded-b-2xl bg-white px-3 py-[6px]">
            <div className={cn(SKELETON_STYLE, "h-[13px] rounded-sm")} />
            <div className={cn(SKELETON_STYLE, "h-[13px] w-[50px] rounded-sm")} />
          </div>
        </div>
      ))}
    </>
  );
};

export default RecentFoundItemSkeleton;
