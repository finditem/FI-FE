import { Button, Icon, DetailHeader, HeaderShare } from "@/components";
import { cn } from "@/utils";

interface PublicDetailSkeletonProps {
  isError?: boolean;
}

const PublicDetailSkeleton = ({ isError = false }: PublicDetailSkeletonProps) => {
  return (
    <>
      <span className="sr-only" role="status">
        상세 정보를 불러오는 중입니다.
      </span>
      <DetailHeader>
        <HeaderShare />
      </DetailHeader>

      <section aria-hidden="true">
        {/* 이미지 */}
        <div
          className={cn(
            "h-[260px] w-full bg-labelsVibrant-quaternary flex-center",
            "tablet:h-[420px]"
          )}
        >
          {isError ? (
            <Icon name="DetailImageFail" size={80} />
          ) : (
            <Icon name="LoadingSkeleton" size={36} className="animate-spin" />
          )}
        </div>

        {/* 작성자 정보 및 연락처 화인 버튼 */}
        <div
          className={cn(
            "flex flex-col gap-5 border-b border-divider-default p-5",
            "tablet:flex-row tablet:items-center tablet:justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="skeleton-animation size-10 rounded-full bg-labelsVibrant-quaternary" />
            <div className="flex flex-col gap-[6px]">
              <div className="skeleton-animation h-3 w-[126px] rounded-full bg-labelsVibrant-quaternary" />
              <div className="skeleton-animation h-3 w-[180px] rounded-full bg-labelsVibrant-quaternary" />
            </div>
          </div>
          <Button
            className={cn(
              "min-h-11 w-full cursor-not-allowed rounded-[10px] transition-colors",
              "!bg-fill-brand-strong-default hover:!bg-fill-brand-strong-hover",
              "tablet:w-[247px]"
            )}
            disabled
          >
            연락처 확인하기
          </Button>
        </div>
      </section>

      {/* 분실물 정보 */}
      <section aria-hidden="true" className="space-y-9 px-5 py-[30px]">
        <div className="space-y-[14px]">
          {/* 칩, 카테고리 */}
          <div className="flex items-center gap-2">
            <div className="skeleton-animation h-6 w-[56px] rounded-[16px] bg-labelsVibrant-quaternary" />
            <div className="skeleton-animation h-6 w-[56px] rounded-[16px] bg-labelsVibrant-quaternary" />
          </div>

          <div className="space-y-8">
            {/* 제목, 본문 */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="skeleton-animation h-3 w-[180px] rounded-[16px] bg-labelsVibrant-quaternary" />
                <div className="skeleton-animation h-3 w-[84px] rounded-[16px] bg-labelsVibrant-quaternary" />
              </div>
              <div className="space-y-2">
                <div className="skeleton-animation h-3 w-full rounded-[16px] bg-labelsVibrant-quaternary" />
                <div className="skeleton-animation h-3 w-[84px] rounded-[16px] bg-labelsVibrant-quaternary" />
              </div>
            </div>
          </div>
        </div>

        {/* 아이템 정보 */}
        <div className="skeleton-animation h-[84px] w-full rounded-[24px] bg-labelsVibrant-quaternary" />

        {/* 보관 정보 */}
        <div className="flex flex-col gap-[18px]">
          <div className="skeleton-animation h-[24px] w-1/4 rounded-[16px] bg-labelsVibrant-quaternary" />
          <div className="skeleton-animation h-[97px] w-full rounded-[24px] bg-labelsVibrant-quaternary" />
        </div>
      </section>
    </>
  );
};

export default PublicDetailSkeleton;
