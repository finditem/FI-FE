import { cn } from "@/utils";

const SKELETON_STYLE = "bg-labelsVibrant-quaternary skeleton-animation";

const RecentFoundItemSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="relative rounded-2xl border-[0.7px] border-divider-default">
          <div className={cn(SKELETON_STYLE, "h-[120px] w-[123px] rounded-2xl")} />
          <div className="absolute bottom-0 right-0 flex w-full flex-col gap-1 rounded-b-2xl bg-white px-3 py-[6px]">
            <div className={cn(SKELETON_STYLE, "h-[13px] rounded-sm")} />
            <div className={cn(SKELETON_STYLE, "h-[13px] w-[50px] rounded-sm")} />
          </div>
        </div>
      ))}
    </>
  );
};

export default RecentFoundItemSkeleton;
