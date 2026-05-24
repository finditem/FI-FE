"use client";

import { useState } from "react";
import { NoticeDetail } from "@/api/fetch/notice";
import { Icon, ImageViewerModal } from "@/components";
import { cn, formatDate, formatViewCount } from "@/utils";
import Image from "next/image";
import { useToggleLike } from "./useToggleLike";

const BADGE_DEFAULT_STYLE = "inline-block rounded-full px-2 py-1 text-caption2-medium text-white";

const NoticeDetailBadges = ({ isNew, isHot }: { isNew: boolean; isHot: boolean }) => {
  if (!isNew && !isHot) return null;

  return (
    <div className="flex items-center gap-1">
      {isNew && <div className={cn(BADGE_DEFAULT_STYLE, "bg-fill-brand-normal-default")}>NEW</div>}
      {isHot && <div className={cn(BADGE_DEFAULT_STYLE, "bg-system-favorite")}>HOT</div>}
    </div>
  );
};

const NoticeDetailContent = ({ noticeDetail }: { noticeDetail: NoticeDetail }) => {
  const [imageViewerState, setImageViewerState] = useState<{
    isOpen: boolean;
    initialIndex: number;
  }>({ isOpen: false, initialIndex: 0 });

  const noticeId = noticeDetail?.noticeId;
  const { handleToggleLike, isPending: isLikePending } = useToggleLike({ noticeId });
  const {
    title,
    content,
    viewCount,
    likeCount,
    authorName,
    isNew,
    isHot,
    createdAt,
    images,
    likeStatus,
  } = noticeDetail;

  return (
    <section className="space-y-3 px-5 py-[30px]">
      <NoticeDetailBadges isNew={isNew} isHot={isHot} />

      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-h2-bold text-layout-header-default">{title}</h1>
          <div className="text-body2-regular text-layout-body-default">
            <time dateTime={createdAt} className="after:mx-2 after:content-['·']">
              {formatDate(createdAt)}
            </time>
            <span>{authorName}</span>
          </div>
        </div>
        <p className="whitespace-pre-line text-body1-regular text-layout-header-default">
          {content}
        </p>

        <div className="flex flex-col gap-[14px]">
          {images &&
            images.map((image, index) => (
              <button
                key={image}
                type="button"
                className="w-full"
                onClick={() => setImageViewerState({ isOpen: true, initialIndex: index })}
                aria-label={`공지사항 상세 이미지 ${index + 1} 보기`}
              >
                <Image
                  src={image}
                  alt="공지사항 상세 이미지"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-auto w-full rounded-[10px]"
                  style={{ width: "100%", height: "auto" }}
                />
              </button>
            ))}
        </div>

        <div className="flex gap-3 text-body2-regular text-neutral-strong-placeholder">
          <button
            type="button"
            aria-label={likeStatus ? "좋아요 취소" : "좋아요"}
            onClick={() => handleToggleLike(likeStatus)}
            className="flex items-center gap-1"
            disabled={isLikePending}
          >
            <Icon
              name={likeStatus ? "LikeActive" : "Like"}
              size={16}
              className={cn(
                "text-border-divider-default transition-colors",
                likeStatus && "text-system-favorite"
              )}
            />
            <span>추천 {formatViewCount(likeCount)}</span>
          </button>
          <div className="flex items-center gap-1">
            <Icon name="Eye" size={16} className="text-border-divider-default" />
            <span>조회 {formatViewCount(viewCount)}</span>
          </div>
        </div>
      </div>

      {images && images.length > 0 && (
        <ImageViewerModal
          images={images}
          initialIndex={imageViewerState.initialIndex}
          isOpen={imageViewerState.isOpen}
          onClose={() => setImageViewerState((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
    </section>
  );
};

export default NoticeDetailContent;
