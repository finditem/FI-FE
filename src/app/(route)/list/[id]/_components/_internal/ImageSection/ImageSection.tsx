"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ImageViewerModal } from "@/components/domain";

import "swiper/css";
import "swiper/css/pagination";
import "./swiper-pagination.css";
import { ImageResponse } from "@/api/fetch/post";

interface ImageSectionProps {
  imageUrls: ImageResponse[];
}

const ImageSection = ({ imageUrls }: ImageSectionProps) => {
  if (imageUrls.length === 0) return null;

  const sortedData = [...imageUrls].sort((a, b) => {
    if (a.imageType === "THUMBNAIL") return -1;
    if (b.imageType === "THUMBNAIL") return 1;
    return 0;
  });
  const imageUrlList = sortedData.map((img) => img.imgUrl);

  const [isOpen, setIsOpen] = useState(false);

  const isDraggingRef = useRef(false);

  const handleOpenIfTap = () => {
    if (isDraggingRef.current) return;
    setIsOpen(true);
  };

  return (
    <>
      <div className="relative cursor-pointer select-none">
        <Swiper
          loop
          modules={[Pagination]}
          pagination={{ clickable: true }}
          onTouchMove={() => {
            isDraggingRef.current = true;
          }}
          onTouchEnd={() => {
            window.setTimeout(() => {
              isDraggingRef.current = false;
            }, 0);
          }}
          onSliderMove={() => {
            isDraggingRef.current = true;
          }}
          onClick={handleOpenIfTap}
        >
          {sortedData.map((image, index) => (
            <SwiperSlide key={image.id}>
              <div className="relative h-[260px] w-full tablet:h-[420px]">
                <Image
                  src={image.imgUrl}
                  alt={`게시글 이미지 ${index + 1}`}
                  fill
                  draggable={false}
                  priority={index === 0}
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ImageViewerModal
        images={imageUrlList}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialIndex={0}
      />
    </>
  );
};

export default ImageSection;
