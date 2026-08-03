import { cn } from "@/utils";

const SKELETON_STYLE = "rounded-2xl bg-labelsVibrant-quaternary skeleton-animation";

const NoticeDetailSkeleton = () => {
  return (
    <div className="space-y-3 px-5 py-[30px]">
      <div className={cn("h-[21px] w-[39px]", SKELETON_STYLE)} />

      <div className="space-y-6">
        <div className="space-y-1">
          <div className={cn("h-6 w-[343px]", SKELETON_STYLE)} />
          <div className="flex items-center gap-2 py-[2px]">
            <div className={cn("h-4 w-20", SKELETON_STYLE)} />
            <div className={cn("h-4 w-[64px]", SKELETON_STYLE)} />
          </div>
        </div>

        <div className="space-y-3 pr-[7px]">
          <div className={cn("h-4 w-full", SKELETON_STYLE)} />
          <div className={cn("h-4 w-full", SKELETON_STYLE)} />
          <div className={cn("h-4 w-full", SKELETON_STYLE)} />
          <div className={cn("h-4 w-[286px]", SKELETON_STYLE)} />
        </div>
      </div>

      <div className="flex items-center gap-[9px]">
        <div className={cn("h-4 w-4 rounded-full", SKELETON_STYLE)} />
        <div className={cn("h-4 w-8 rounded-2xl", SKELETON_STYLE)} />
        <div className={cn("h-4 w-4 rounded-full", SKELETON_STYLE)} />
        <div className={cn("h-4 w-8 rounded-2xl", SKELETON_STYLE)} />
      </div>
    </div>
  );
};

export default NoticeDetailSkeleton;
