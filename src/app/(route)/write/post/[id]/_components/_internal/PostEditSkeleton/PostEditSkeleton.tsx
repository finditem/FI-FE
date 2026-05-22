"use client";

import { DetailHeader } from "@/components";

const PostEditSkeleton = () => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden" aria-hidden="true">
      <DetailHeader title="게시글 수정" />

      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* WriteImageSection Skeleton */}
        <section className="flex flex-col items-start justify-center gap-4 border-b px-5 py-6">
          <div className="flex flex-nowrap items-center gap-4">
            <div className="skeleton-animation skeleton-animation size-[104px] shrink-0 rounded-[6px]" />
            <div className="skeleton-animation skeleton-animation size-[104px] shrink-0 rounded-[10px]" />
          </div>
          <div className="skeleton-animation skeleton-animation h-3 w-[260px] rounded-full" />
        </section>

        {/* CategorySection Skeleton */}
        <section className="flex items-center justify-between border-b border-flatGray-50 px-5 py-[34px]">
          <div className="skeleton-animation skeleton-animation h-4 w-[140px] rounded-full" />
          <div className="skeleton-animation skeleton-animation size-6 rounded-full" />
        </section>

        {/* TitleSection Skeleton */}
        <section className="border-b border-flatGray-50 px-5 py-[34px]">
          <div className="skeleton-animation skeleton-animation h-4 w-[180px] rounded-full" />
        </section>

        {/* ContentSection Skeleton */}
        <section className="min-h-[200px] flex-1 border-b border-flatGray-50 px-5 py-6">
          <div className="flex flex-col gap-3">
            <div className="skeleton-animation skeleton-animation h-4 w-full rounded-full" />
            <div className="skeleton-animation skeleton-animation h-4 w-3/4 rounded-full" />
            <div className="skeleton-animation skeleton-animation h-4 w-1/2 rounded-full" />
          </div>
        </section>

        {/* LocationSection Skeleton */}
        <section className="flex items-center justify-between border-b border-flatGray-50 px-5 py-[34px]">
          <div className="skeleton-animation skeleton-animation h-4 w-[120px] rounded-full" />
          <div className="skeleton-animation skeleton-animation size-6 rounded-full" />
        </section>
      </div>

      <section className="px-5 pb-8 pt-3">
        <div className="skeleton-animation skeleton-animation h-12 w-full rounded-[10px]" />
      </section>
    </div>
  );
};

export default PostEditSkeleton;
