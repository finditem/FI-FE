"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageList } from "@/types";
import Image from "next/image";
import { ImageViewerModal } from "@/components/domain";

/**
 * 댓글 내용 및 이미지
 *
 * @author jikwon
 */

interface CommentBodyProps {
  bodyData: {
    /** 댓글 내용 */
    content: string;
    /** 댓글 이미지 목록 */
    images: ImageList[];
  };
}

const CommentBody = ({ bodyData }: CommentBodyProps) => {
  const t = useTranslations("CommentBody");
  const { content, images } = bodyData;
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setInitialIndex(index);
    setIsViewerOpen(true);
  };

  const imageUrls = images.map((image) => image.imageUrl);

  return (
    <div>
      <p className="whitespace-pre-wrap break-all text-body1-regular text-layout-header-default">
        {content}
      </p>
      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((image, i) => (
            <Image
              key={image.id}
              src={image.imageUrl}
              width={80}
              height={80}
              alt={t("imageAlt", { number: i + 1 })}
              className="h-20 w-20 cursor-pointer rounded-[16px] object-cover"
              onClick={() => handleImageClick(i)}
            />
          ))}
        </div>
      )}

      <ImageViewerModal
        images={imageUrls}
        initialIndex={initialIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
};

export default CommentBody;
