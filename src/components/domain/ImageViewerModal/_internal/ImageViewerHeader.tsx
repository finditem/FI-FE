import { Icon } from "@/components/common";
import { cn } from "@/utils";
import { downloadImage } from "../_utils/imageViewer";
import type { Swiper as SwiperType } from "swiper";
import { RefObject } from "react";
import { ImageInfo } from "../_types/ImageInfo";
import formatDateWithTime from "./formatDateWithTime";

interface ImageViewerHeaderProps {
  onClose: () => void;
  swiperRef: RefObject<SwiperType | null>;
  images: string[];
  initialIndex: number;
  imageInfo?: ImageInfo;
}

const NAV_BUTTON_STYLE = "h-10 rounded-[10px] bg-fill-neutralInversed-strong-default flex-center";

const ImageViewerHeader = ({
  onClose,
  swiperRef,
  images,
  initialIndex,
  imageInfo,
}: ImageViewerHeaderProps) => {
  const getCurrentImage = () => {
    const currentIndex = swiperRef.current?.realIndex ?? initialIndex;
    return images[currentIndex];
  };

  return (
    <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-[var(--safe-area-top)]">
      <button
        onClick={onClose}
        className={cn(NAV_BUTTON_STYLE, "w-10")}
        aria-label="이미지 상세 보기 닫기"
      >
        <Icon name="ArrowLeftSmall" size={18} className="text-neutralInversed-strong-default" />
      </button>
      {imageInfo && (
        <div className="flex flex-col items-center">
          <span className="text-body2-semibold text-neutralInversed-strong-default">
            {imageInfo.uploader}
          </span>
          <time className="text-caption1-medium text-layout-body-default">
            {formatDateWithTime(imageInfo.createdAt)}
          </time>
        </div>
      )}
      <button
        className={cn(NAV_BUTTON_STYLE, "w-[46px]")}
        aria-label="이미지 다운로드"
        onClick={(e) => {
          e.stopPropagation();
          downloadImage(getCurrentImage());
        }}
      >
        <Icon name="Download" size={18} />
      </button>
    </header>
  );
};

export default ImageViewerHeader;
