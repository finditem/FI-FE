import { Button, Icon, DetailHeader, HeaderMenu, HeaderShare, HeaderStar } from "@/components";
import { cn } from "@/utils";

interface DetailSkeletonProps {
  isError?: boolean;
}

const DetailSkeleton = ({ isError = false }: DetailSkeletonProps) => {
  return (
    <>
      <span className="sr-only" role="status">
        상세 정보를 불러오는 중입니다.
      </span>
      <DetailHeader>
        <HeaderStar isActive={false} />
        <HeaderShare />
        <HeaderMenu />
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
        {/* 작성자 정보 및 채팅하기 버튼 */}
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
            채팅하러 가기
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
            {/* 조회수, 즐겨찾기 */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                <div className="skeleton-animation size-4 rounded-full bg-labelsVibrant-quaternary" />
                <div className="skeleton-animation h-3 w-[70px] rounded-[16px] bg-labelsVibrant-quaternary" />
              </div>
              <div className="flex items-center gap-1">
                <div className="skeleton-animation size-4 rounded-full bg-labelsVibrant-quaternary" />
                <div className="skeleton-animation h-3 w-[70px] rounded-[16px] bg-labelsVibrant-quaternary" />
              </div>
            </div>
          </div>
          <div className="space-y-[18px] pt-9">
            {/* 지도 */}
            <div
              className={cn(
                "skeleton-animation h-[147px] w-full rounded-[6px] bg-labelsVibrant-quaternary",
                "tablet:h-[200px]"
              )}
            />
            {/* 주소 */}
            <div className="flex items-center gap-1">
              <div className="skeleton-animation size-4 rounded-full bg-labelsVibrant-quaternary" />
              <div className="skeleton-animation h-3 w-[120px] rounded-[16px] bg-labelsVibrant-quaternary" />
            </div>
          </div>
        </div>
      </section>

      {/* 댓글 영역 */}
      <section aria-hidden="true" className="border-t border-divider-default pt-[18px]">
        {/* 댓글 수 */}
        <div className="px-5 py-2">
          <div className="skeleton-animation h-3 w-[80px] rounded-[16px] bg-labelsVibrant-quaternary" />
        </div>
        {/* 댓글 아이템 */}
        <div className="space-y-6 border-b border-divider-default py-[18px]">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      </section>

      <div aria-hidden="true" className="mb-[49px] space-y-3 py-[18px]">
        {/* 비슷한 아이템 제목 */}
        <div className="px-5 py-1">
          <div className="skeleton-animation h-3 w-[108px] rounded-[16px] bg-labelsVibrant-quaternary" />
        </div>

        {/* 비슷한 아이템 리스트 */}
        <div className="flex gap-6 overflow-x-auto pl-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SimilarSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailSkeleton;

const CommentSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-2 px-5">
      <div className="space-y-3">
        {/* 프로필 이미지, 닉네임, 시간 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="skeleton-animation size-10 rounded-full bg-labelsVibrant-quaternary" />
            <div className="flex flex-col gap-[6px]">
              <div className="skeleton-animation h-3 w-[160px] rounded-full bg-labelsVibrant-quaternary" />
              <div className="skeleton-animation h-3 w-[80px] rounded-full bg-labelsVibrant-quaternary" />
            </div>
          </div>
          <Icon name="DetailMenu" size={20} />
        </div>

        {/* 댓글 내용 */}
        <div className="space-y-2">
          <div className="skeleton-animation h-3 w-full rounded-full bg-labelsVibrant-quaternary" />
          <div className="skeleton-animation h-3 w-[180px] rounded-full bg-labelsVibrant-quaternary" />
        </div>
      </div>

      {/* 좋아요 및 좋아요 수 */}
      <div className="flex items-center gap-1">
        <div className="skeleton-animation size-4 rounded-full bg-labelsVibrant-quaternary" />
        <div className="skeleton-animation h-3 w-[70px] rounded-[16px] bg-labelsVibrant-quaternary" />
      </div>

      {/* 답글 수 및 답글 버튼 */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex items-center gap-1">
          <div className="skeleton-animation h-3 w-[70px] rounded-[16px] bg-labelsVibrant-quaternary" />
          <div className="skeleton-animation size-4 rounded-full bg-labelsVibrant-quaternary" />
        </div>
        <div className="flex items-center gap-1">
          <div className="skeleton-animation h-3 w-[70px] rounded-[16px] bg-labelsVibrant-quaternary" />
          <div className="skeleton-animation size-4 rounded-full bg-labelsVibrant-quaternary" />
        </div>
      </div>
    </div>
  );
};

const SimilarSkeleton = () => {
  return (
    <article
      aria-hidden="true"
      className="flex w-[126px] shrink-0 flex-col items-start justify-center gap-3"
    >
      {/* 이미지 */}
      <div
        className={cn(
          "h-[126px] w-full rounded-[6px]",
          "skeleton-animation bg-labelsVibrant-quaternary"
        )}
      />

      {/* 제목, 지역, 시간 */}
      <div className="flex w-full flex-col gap-[6px]">
        <div
          className={cn(
            "h-3 w-full rounded-full",
            "skeleton-animation bg-labelsVibrant-quaternary"
          )}
        />
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-3 w-full rounded-full",
              "skeleton-animation bg-labelsVibrant-quaternary"
            )}
          />
        </div>
      </div>

      {/* 아이콘 */}
      <ul className="flex w-full items-center gap-2" aria-hidden="true">
        <li className="flex w-full items-center gap-1">
          <div
            className={cn("size-4 rounded-full", "skeleton-animation bg-labelsVibrant-quaternary")}
          />
          <div
            className={cn(
              "h-3 flex-1 rounded-full",
              "skeleton-animation bg-labelsVibrant-quaternary"
            )}
          />
        </li>
        <li className="flex w-full items-center gap-1">
          <div
            className={cn("size-4 rounded-full", "skeleton-animation bg-labelsVibrant-quaternary")}
          />
          <div
            className={cn(
              "h-3 flex-1 rounded-full",
              "skeleton-animation bg-labelsVibrant-quaternary"
            )}
          />
        </li>
      </ul>
    </article>
  );
};
