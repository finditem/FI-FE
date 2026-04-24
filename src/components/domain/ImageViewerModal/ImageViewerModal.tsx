"use client";

import { createPortal } from "react-dom";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import ImageViewerHeader from "./_internal/ImageViewerHeader";
import ImageViewerNavigation from "./_internal/ImageViewerNavigation";
import useImageViewerNavigation from "./_hooks/useImageViewerNavigation";

import "swiper/css";
import "swiper/css/pagination";
import "./_internal/swiper-pagination.css";
import { ImageInfo } from "./_types/ImageInfo";

/**
 * 이미지 URL 목록을 전체 화면 슬라이드로 보여 주는 뷰어 모달입니다.
 *
 * @remarks
 * - `isOpen`이 `false`이면 `null`만 반환하고 포털을 쓰지 않습니다.
 * - 열리면 `createPortal`로 `document.body`에 붙으며, `role="dialog"`와 `aria-modal`을 둡니다.
 * - 키보드 `Escape`는 닫기, 좌·우 화살표는 이전·다음 슬라이드로 연결됩니다(`useImageViewerNavigation`).
 * - 이미지가 2장 미만이면 좌우 화살표 버튼은 렌더되지 않습니다.
 *
 * @author hyungjun
 */
interface ImageViewerModalProps {
  /** 표시할 이미지의 `src` URL 목록 */
  images: string[];
  /** 처음에 맞출 슬라이드 인덱스(Swiper `initialSlide`) */
  initialIndex: number;
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 요청 시 호출(헤더 닫기, ESC 등) */
  onClose: () => void;
  /** 헤더에 업로더·작성 시각 등을 노출할 때 전달 */
  imageInfo?: ImageInfo;
}

/**
 * @example
 * ```tsx
 * <ImageViewerModal
 *   images={urls}
 *   initialIndex={0}
 *   isOpen={viewerOpen}
 *   onClose={() => setViewerOpen(false)}
 *   imageInfo={{ uploader: "닉네임", createdAt: new Date().toISOString() }}
 * />
 * ```
 */

const ImageViewerModal = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  imageInfo,
}: ImageViewerModalProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  useImageViewerNavigation({ isOpen, onClose, handlePrev, handleNext });

  if (!isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="이미지 상세 보기 모달"
      className="fixed inset-0 z-50 bg-dimOpaque"
    >
      <ImageViewerHeader
        swiperRef={swiperRef}
        images={images}
        initialIndex={initialIndex}
        onClose={onClose}
        imageInfo={imageInfo}
      />

      <div className="flex h-full items-center justify-center">
        <ImageViewerNavigation
          handleNext={handleNext}
          handlePrev={handlePrev}
          imagesLength={images.length}
        />

        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop
          initialSlide={initialIndex}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="h-[80vh] w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full select-none">
                <Image
                  src={image}
                  alt={`상세 이미지 ${index + 1}`}
                  fill
                  className="select-none object-contain"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageViewerModal;
