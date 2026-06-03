"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminDetailGuestInquiry, AdminDetailInquiry, AdminDetailReport } from "@/api/fetch/admin";
import { formatDate } from "@/utils";
import { getDetailContentVM } from "../../../_utils/DetailContentVM";
import { ImageViewerModal } from "@/components";

interface DetailContentProps {
  data: AdminDetailGuestInquiry | AdminDetailReport | AdminDetailInquiry;
}

const DetailContent = ({ data }: DetailContentProps) => {
  const viewModel = getDetailContentVM(data);
  const [imageViewerState, setImageViewerState] = useState<{
    isOpen: boolean;
    initialIndex: number;
  }>({ isOpen: false, initialIndex: 0 });

  if (!viewModel) return null;

  const { title, content, createdAt, userEmailLabel, imageUrls } = viewModel;

  return (
    <>
      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-h2-bold text-layout-header-default">{title}</h2>
          <div className="flex items-center text-body2-regular text-layout-body-default">
            <span className="block after:mx-1 after:content-['·']">{userEmailLabel}</span>
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </div>
        </div>

        <p className="text-body1-regular text-layout-header-default">{content}</p>

        {imageUrls && imageUrls.length > 0 && (
          <div className="grid grid-cols-1 gap-2 pt-[6px]">
            {imageUrls.map((url, index) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-[10px]">
                <button
                  type="button"
                  onClick={() => setImageViewerState({ isOpen: true, initialIndex: index })}
                  aria-label={`${index + 1}번째 이미지 보기`}
                >
                  <Image
                    fill
                    src={url}
                    alt={`이미지 ${index + 1}`}
                    draggable={false}
                    className="select-none object-cover"
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {imageUrls && imageUrls.length > 0 && (
        <ImageViewerModal
          images={imageUrls}
          initialIndex={imageViewerState.initialIndex}
          isOpen={imageViewerState.isOpen}
          onClose={() => setImageViewerState((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
    </>
  );
};

export default DetailContent;
