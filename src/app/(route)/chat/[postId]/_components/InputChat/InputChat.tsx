"use client";

import { ChangeEvent, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { cn, textareaAutoResize, fileInputHandler, textareaSubmitKeyHandler } from "@/utils";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { Icon } from "@/components/common";
import InputChatImageSection from "./_internal/InputChatImageSection";
import { SelectedImage } from "@/types/SelectedImage";

interface InputChatProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  validation?: RegisterOptions;
  disabled?: boolean;
  roomId: number;
  userId: number;
  onImageSendSuccess?: () => void;
}

const InputChat = ({
  name,
  validation,
  disabled,
  roomId,
  userId,
  onImageSendSuccess,
  ...props
}: InputChatProps) => {
  const { control, watch } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const contentValue = watch(name);

  useEffect(() => {
    if (!textareaRef.current) return;

    if (contentValue === "") {
      textareaRef.current.style.height = "auto";
    }
  }, [contentValue]);

  return (
    <>
      {images?.length !== 0 ? (
        <InputChatImageSection
          ids={{ roomId, userId }}
          onImageSendSuccess={onImageSendSuccess}
          imageState={{
            images,
            setImages,
            selectedImages,
            setSelectedImages,
          }}
        />
      ) : (
        <Controller
          name={name}
          control={control}
          rules={validation}
          render={({ field }) => (
            <div className="flex w-full flex-row items-end gap-2 overflow-y-visible">
              {/* 이미지 첨부 */}
              <label
                htmlFor="ImageAttach"
                className="relative h-11 w-11 shrink-0 rounded-full bg-fill-neutral-strong-default"
                aria-label="이미지 첨부"
                role="button"
              >
                <Icon
                  name="Image"
                  size={20}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutralInversed-normal-default"
                />
              </label>
              <input
                id="ImageAttach"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={disabled}
                onChange={(e) => fileInputHandler(e, images, setImages)}
              />

              {/* 입력창 */}
              <textarea
                {...props}
                {...field}
                ref={(e) => {
                  field.ref(e);
                  textareaRef.current = e;
                }}
                rows={1}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  field.onChange(e);
                  textareaAutoResize(e.target);
                }}
                onKeyDown={(e) => textareaSubmitKeyHandler(e, textareaRef)}
                className={cn(
                  "max-h-[120px] min-h-11 min-w-0 flex-1 resize-none overflow-y-hidden rounded-[24px] px-4 py-[10px] text-body1-medium text-neutral-normal-placeholder bg-fill-neutral-strong-default focus:text-black disabled:text-neutral-strong-disabled",
                  field.value && "text-neutral-strong-focused"
                )}
                placeholder="메시지 보내기"
                disabled={disabled}
                maxLength={255}
              />

              {/* 전송 버튼 */}
              <button
                type="submit"
                className="relative h-11 w-11 shrink-0 rounded-full transition-colors bg-fill-brand-normal-default hover:bg-fill-brand-normal-disabled active:bg-fill-brand-normal-default disabled:bg-fill-brand-normal-disabled"
                aria-label="전송 버튼"
                disabled={disabled || !field.value?.trim()}
              >
                <Icon
                  name="SendArrow"
                  size={20}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                />
              </button>
            </div>
          )}
        />
      )}
    </>
  );
};

export default InputChat;
