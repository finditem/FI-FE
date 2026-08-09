"use client";

import { useObjectURLs, useHorizontalDragScroll } from "@/hooks";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";

interface InputCommentImageSectionProps {
  images: File[];
  setImages: (images: File[]) => void;
}

const InputCommentImageSection = ({ images, setImages }: InputCommentImageSectionProps) => {
  const t = useTranslations("InputCommentImageSection");
  const urls = useObjectURLs(images);
  const { ref: scrollRef, onMouseDown } = useHorizontalDragScroll();

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      role="region"
      aria-label={t("listAriaLabel")}
      className="mb-4 flex h-[90px] w-full select-none gap-5 overflow-x-auto bg-white pt-[10px] no-scrollbar"
    >
      {urls.map((url, index) => (
        <div key={url} className="relative h-[80px] w-[80px] shrink-0 rounded-[16px]">
          <Image
            src={url}
            alt={t("imageAlt", { number: index + 1 })}
            className="h-[80px] w-[80px] rounded-[16px] object-cover"
            width={80}
            height={80}
          />
          <button
            type="button"
            aria-label={t("deleteAriaLabel")}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              setImages(images.filter((_, i) => i !== index));
            }}
            className="absolute right-[2.67px] top-[2.67px] h-[17.78px] w-[17.78px] rounded-full border-[1.07px] border-divider-default bg-flatGray-600 flex-center"
          >
            <Icon name="CommentImageClear" size={7.43} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default InputCommentImageSection;
