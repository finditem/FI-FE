"use client";

import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Icon } from "@/components/common";
import ImagePreviewList from "./_internal/ImagePreviewList";
import { useToast } from "@/context/ToastContext";
import { PostWriteFormValues } from "@/app/(route)/write/post/_types/PostWriteType";

const DEFAULT_HELP_TEXT = "최대 10MB, 총 5장의 이미지를 첨부할 수 있습니다. (jpg, jpeg, png)";

/**
 * 게시글 작성 화면에서 이미지 첨부·미리보기·순서 조절을 담당하는 섹션입니다.
 *
 * @remarks
 * - `FormProvider`와 `PostWriteFormValues`의 `images` 필드 배열(`useFieldArray`)이 있어야 합니다.
 * - 첨부는 최대 5장이며, 초과 시 토스트로 안내하고 추가하지 않습니다.
 * - 파일 입력은 `image/png`, `jpeg`, `jpg`만 받으며, `handleImageChange`에서 이미지 MIME만 필터합니다.
 * - `"use client"`이며 `useToast`로 경고 토스트를 띄웁니다.
 *
 * @author hyungjun
 */
interface WriteImageSectionProps {
  /** 하단 안내 문구 (default: 파일 상단 `DEFAULT_HELP_TEXT`) */
  helpText?: string;
}

/**
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <WriteImageSection />
 *   <WriteImageSection helpText="커스텀 안내 문구" />
 * </FormProvider>
 * ```
 */

const WriteImageSection = ({ helpText = DEFAULT_HELP_TEXT }: WriteImageSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const { control } = useFormContext<PostWriteFormValues>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "images" });

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = () => {
    const files = fileInputRef.current?.files;
    if (!files) return;

    const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));

    const remainCount = 5 - fields.length;

    if (remainCount <= 0 || fileArray.length > remainCount) {
      addToast("이미지는 최대 5장만 첨부할 수 있어요.", "warning");
      return;
    }

    fileArray.slice(0, remainCount).forEach((file) => {
      append({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });
  };

  return (
    <section className="flex w-full flex-col justify-center gap-4 overflow-hidden border-b border-flatGray-50 px-5 py-6">
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        multiple
        ref={fileInputRef}
        onChange={handleImageChange}
      />

      <div className="hide-scrollbar flex w-full max-w-full flex-nowrap items-center gap-4 overflow-x-scroll">
        <button
          type="button"
          aria-label="이미지 업로드"
          onClick={openImagePicker}
          className="size-[104px] shrink-0 rounded-[6px] bg-flatGray-25 flex-col-center"
        >
          <Icon name="Camera" size={32} className="text-neutralInversed-strong-default" />
          <span className="select-none text-caption1-regular text-flatGray-400">
            ({fields.length}/5)
          </span>
        </button>
        <ImagePreviewList images={fields} onRemove={remove} onMove={move} />
      </div>
      <span className="text-caption1-regular text-neutral-normal-placeholder">{helpText}</span>
    </section>
  );
};

export default WriteImageSection;
