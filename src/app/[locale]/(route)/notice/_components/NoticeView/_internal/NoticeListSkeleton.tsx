import { cn } from "@/utils";

const SKELETON_STYLE = "bg-labelsVibrant-quaternary skeleton-animation";

const NoticeListSkeletonItem = () => {
  return (
    <li className="flex w-full items-center justify-between gap-2 border-b border-divider-default px-5 py-[30px]">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-[5px]">
          <div className={cn(SKELETON_STYLE, "h-6 w-[225px] rounded-md")} />
          <div className={cn(SKELETON_STYLE, "h-4 w-[117px] rounded-md")} />
        </div>

        <div className="flex gap-[9px] py-[2px]">
          <div className={cn(SKELETON_STYLE, "size-4 rounded-full")} />
          <div className={cn(SKELETON_STYLE, "h-4 w-8 rounded-md")} />
          <div className={cn(SKELETON_STYLE, "size-4 rounded-full")} />
          <div className={cn(SKELETON_STYLE, "h-4 w-8 rounded-md")} />
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className={cn(SKELETON_STYLE, "h-[90px] w-[90px] rounded-2xl")} />
      </div>
    </li>
  );
};

const NoticeListSkeleton = () => {
  return (
    <ul>
      {Array.from({ length: 5 }).map((_, index) => (
        <NoticeListSkeletonItem key={index} />
      ))}
    </ul>
  );
};

export default NoticeListSkeleton;
