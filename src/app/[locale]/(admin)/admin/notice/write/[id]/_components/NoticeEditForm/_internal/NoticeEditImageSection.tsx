"use client";

import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Icon, ImagePreviewList } from "@/components";
import { useToast } from "@/context/ToastContext";
import { NoticeEditFormValues } from "../../../_types/NoticeEditFormValues";
import { NoticeEditImageItem } from "../../../_types/NoticeEditImageItem";

const DEFAULT_HELP_TEXT = "*사진은 최대 5장 첨부가 가능합니다. (선택)";
const MAX_IMAGES = 5;

const NoticeEditImageSection = ({ helpText = DEFAULT_HELP_TEXT }: { helpText?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const { control, getValues } = useFormContext<NoticeEditFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "images" });

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = () => {
    const files = fileInputRef.current?.files;
    if (!files) return;

    const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const remainCount = MAX_IMAGES - fields.length;

    if (remainCount <= 0 || fileArray.length > remainCount) {
      addToast("이미지는 최대 5장만 첨부할 수 있어요", "warning");
      return;
    }

    fileArray.slice(0, remainCount).forEach((file) => {
      append({
        file,
        previewUrl: URL.createObjectURL(file),
      } satisfies NoticeEditImageItem);
    });
  };

  const handleRemove = (index: number) => {
    const current = getValues("images");
    const target = current?.[index];
    if (target?.file && target.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }
    remove(index);
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
            ({fields.length}/{MAX_IMAGES})
          </span>
        </button>

        <ImagePreviewList images={fields} onRemove={handleRemove} onMove={move} />
      </div>

      <span className="text-caption1-regular text-neutral-normal-placeholder">{helpText}</span>
    </section>
  );
};

export default NoticeEditImageSection;
