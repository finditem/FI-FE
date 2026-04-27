"use client";

import { Dispatch, SetStateAction } from "react";
import { cn, fileInputHandler } from "@/utils";
import Image from "next/image";
import { handleClick, getImageButtonState } from "./_utils";
import { useObjectURLs } from "@/hooks";
import { Icon } from "@/components/common";
import { SelectedImage } from "@/types/SelectedImage";

/**
 * 이미지 파일을 첨부하고, 썸네일마다 다중 선택·순서를 표시하는 컨트롤입니다.
 *
 * @remarks
 * - 첨부된 `File` 목록과 선택 상태(`SelectedImage`)는 부모 state로 관리합니다.
 * - `images`가 5개 이상이면 파일 입력·첨부 트리거가 비활성화됩니다.
 * - 썸네일 버튼 클릭 시 해당 인덱스 선택이 토글되고, 선택된 항목에는 순서 뱃지가 보입니다.
 * - 타입상 `ButtonHTMLAttributes`를 확장하지만, 구현에서는 아래 필드와 `ariaLabel`만 사용합니다.
 *
 * @author hyungjun
 */

interface ToggleImageButtonProps {
  /** `role="group"` 컨테이너에 붙는 접근성 라벨 */
  ariaLabel?: string;
  /** 미리보기·선택 대상이 되는 이미지 파일 목록 */
  images: File[];
  /** 첨부 입력으로 갱신되는 `images` setter */
  setImages: Dispatch<SetStateAction<File[]>>;
  /** 선택된 썸네일 인덱스와 사용자에게 보여 줄 순서 */
  selectedImages: SelectedImage[];
  /** 썸네일 클릭 시 토글·순서 재계산에 쓰는 setter */
  setSelectedImages: Dispatch<SetStateAction<SelectedImage[]>>;
}

/**
 * @example
 * ```tsx
 * import { useState } from "react";
 * import type { SelectedImage } from "@/types/SelectedImage";
 *
 * const [images, setImages] = useState<File[]>([]);
 * const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
 *
 * <ToggleImageButton
 *   ariaLabel="프로필 이미지 선택"
 *   images={images}
 *   setImages={setImages}
 *   selectedImages={selectedImages}
 *   setSelectedImages={setSelectedImages}
 * />
 * ```
 */

const ToggleImageButton = ({
  ariaLabel,
  images,
  setImages,
  selectedImages,
  setSelectedImages,
}: ToggleImageButtonProps) => {
  const urls = useObjectURLs(images);
  const isDisabled = images.length >= 5;

  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,_104px)] justify-center gap-x-[20px] gap-y-[16px]"
      aria-label={ariaLabel}
      role="group"
    >
      <label
        htmlFor="ImageAttach"
        className={cn(
          "h-[100px] w-[100px] rounded-[10px] bg-fill-neutral-strong-default flex-center",
          isDisabled && "pointer-events-none"
        )}
        aria-label="이미지 첨부"
        role="button"
        aria-disabled={isDisabled}
      >
        <Icon name="Image" size={26} />
      </label>
      <input
        id="ImageAttach"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={isDisabled}
        onChange={(e) => fileInputHandler(e, images, setImages)}
      />

      {urls.map((src, index) => {
        const { isActive, order } = getImageButtonState(index, selectedImages);

        return (
          <button
            key={index}
            onClick={() => handleClick(index, setSelectedImages)}
            className={cn(
              "relative rounded-[10px] border-2 transition-all duration-75",
              isActive ? "border-brand-normal-default" : "border-transparent"
            )}
          >
            <div className="relative h-[100px] w-[100px]">
              {urls[index] && (
                <Image
                  src={src}
                  width={100}
                  height={100}
                  alt={`${index + 1}번째 가져온 이미지`}
                  className="glass-card h-full w-full rounded-[10px] object-cover"
                />
              )}

              <span
                className={cn(
                  "absolute right-[6px] top-[6px] h-[20px] w-[20px] rounded-full border-[1.2px] text-caption1-semibold flex-center",
                  isActive
                    ? "border-[#1EB87B] text-white bg-fill-flatGreen-500"
                    : "text-fill-flatGreen-500 border-[#DFDFDF] bg-white"
                )}
              >
                {order}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ToggleImageButton;
