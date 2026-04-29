"use client";

import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import InputCommentImageSection from "./_internal/InputCommentImageSection";
import { Icon } from "@/components/common";
import { cn, fileInputHandler, textareaAutoResize, textareaSubmitKeyHandler } from "@/utils";

interface InputCommentFieldProps {
  name: string;
  validation?: RegisterOptions;
  disabled?: boolean;
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
}

/**
 * @author hyungjun
 *
 * @description
 * 댓글 입력 UI(텍스트 + 이미지 첨부 + 전송 버튼)를 제공하는 공통 컴포넌트입니다.
 *
 * **사용하는 쪽에서 처리할 작업**
 * - `FormProvider` + `useForm`으로 폼을 감싸고, `form`의 `onSubmit`에서 전송 로직 처리
 * - `images`, `setImages` state를 선언해 전달 (이미지 첨부 상태는 사용처에서 관리)
 * - submit 시: form 값(`content`)과 `images`를 수집 후 API 호출. 이미지가 있으면 S3 업로드 → URL 수신 → 댓글 API에 `image: urls` 포함해 호출하는 식으로 구현
 * - API 성공 시 `methods.reset()` 및 `setImages([])`로 초기화. `mutate`의 `onSuccess` 콜백에서 초기화 처리
 * - (선택) `validation`, `disabled` 전달
 *
 * @param name - react-hook-form 필드명.
 * @param validation - content 필드 검증 규칙. (선택)
 * @param disabled - 입력·전송 비활성화. (기본값: `false`)
 * @param images - 첨부 이미지 파일 배열. 사용처 state에서 전달.
 * @param setImages - 첨부 이미지 state setter. 사용처에서 전달.
 *
 * @example
 * ```tsx
 * const [images, setImages] = useState<File[]>([]);
 * const methods = useForm();
 *
 * const onSubmit = (data) => {
 *   // 이미지/댓글 검증 작업
 *   // 댓글 API 호출(이미지는 S3 업로드 후 URL 수신)
 *   // 성공 시 methods.reset(); setImages([]);
 * };
 *
 * <FormProvider {...methods}>
 *   <form onSubmit={methods.handleSubmit(onSubmit)}>
 *     <InputComment name="content" images={images} setImages={setImages} />
 *   </form>
 * </FormProvider>
 * ```
 */

const InputCommentField = ({
  name,
  validation,
  disabled,
  images,
  setImages,
}: InputCommentFieldProps) => {
  const { control } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <>
      {images.length > 0 && <InputCommentImageSection images={images} setImages={setImages} />}
      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => {
          const { ref: _ref, onChange: _onChange, ...fieldRest } = field;
          return (
            <div className="flex w-full flex-row items-end gap-2 overflow-y-visible">
              <label
                htmlFor="ImageAttach"
                className="relative h-11 w-11 shrink-0 cursor-pointer rounded-full bg-fill-neutral-strong-default"
                aria-label="이미지 첨부"
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
                className="sr-only"
                disabled={disabled}
                onChange={(e) => fileInputHandler(e, images, setImages)}
              />

              <textarea
                ref={(el) => {
                  field.ref(el);
                  textareaRef.current = el;
                }}
                rows={1}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  field.onChange(e);
                  textareaAutoResize(e.target);
                }}
                onKeyDown={(e) => textareaSubmitKeyHandler(e, textareaRef)}
                className={cn(
                  "max-h-[120px] min-h-11 min-w-0 flex-1 resize-none overflow-y-hidden rounded-[24px] px-4 py-[10px] text-body1-medium text-neutral-strong-focused bg-fill-neutral-strong-default placeholder:text-neutral-normal-placeholder",
                  "disabled:text-neutral-strong-disabled"
                )}
                placeholder="메시지 보내기"
                disabled={disabled}
                maxLength={250}
                {...fieldRest}
              />

              <button
                type="submit"
                className={cn(
                  "relative h-11 w-11 shrink-0 rounded-full transition-colors duration-150 bg-fill-brand-normal-default",
                  "hover:bg-fill-brand-normal-disabled",
                  "active:bg-fill-brand-normal-default",
                  "disabled:bg-fill-brand-normal-disabled"
                )}
                aria-label="전송 버튼"
                disabled={disabled || (!field.value?.trim() && images.length === 0)}
              >
                <Icon
                  name="SendArrow"
                  size={20}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                />
              </button>
            </div>
          );
        }}
      />
    </>
  );
};

export default InputCommentField;
