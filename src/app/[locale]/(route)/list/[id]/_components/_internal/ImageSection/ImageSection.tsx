"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ImageViewerModal } from "@/components";

import "swiper/css";
import "swiper/css/pagination";
import "./swiper-pagination.css";
import { ImageResponse } from "@/api/fetch/post";

interface ImageSectionProps {
  imageUrls: ImageResponse[];
}

const ImageSection = ({ imageUrls }: ImageSectionProps) => {
  const t = useTranslations("ImageSection");
  // hook은 early return보다 먼저 호출한다. 서버 데이터에서 클라이언트 조회 결과로 바뀌며 이미지 개수가
  // 0장과 그 이상 사이를 오가면 hook 개수가 달라져 렌더가 크래시하기 때문이다.
  const [isOpen, setIsOpen] = useState(false);
  const isDraggingRef = useRef(false);

  if (imageUrls.length === 0) return null;

  const sortedData = [...imageUrls].sort((a, b) => {
    if (a.imageType === "THUMBNAIL") return -1;
    if (b.imageType === "THUMBNAIL") return 1;
    return 0;
  });
  const imageUrlList = sortedData.map((img) => img.imgUrl);

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
                  alt={t("imageAlt", { index: index + 1 })}
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
