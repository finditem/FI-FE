"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Icon } from "@/components/common";
import { cn } from "@/utils";

/**
 * 답글에 대한 답글 전송 폼
 *
 * @author jikwon
 */

interface ReplyFormProps {
  /** 답글 여부 */
  isThreadItem: boolean;
  /** 추가적인 스타일 클래스 */
  className?: string;
  /** 답글 등록 비활성화 여부 */
  disabled?: boolean;
  /** 답글 등록 중 상태 */
  isPending?: boolean;
  /** 답글 등록 함수 */
  onSubmit: (content: string, image: File | null) => void;
}

const ReplyForm = ({ isThreadItem, className, disabled, onSubmit, isPending }: ReplyFormProps) => {
  const t = useTranslations("ReplyForm");
  const inputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const nextHeight = Math.min(el.scrollHeight, 200);
    el.style.height = `${nextHeight}px`;

    el.style.overflowY = el.scrollHeight > 200 ? "auto" : "hidden";
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    requestAnimationFrame(resizeTextarea);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending || !content.trim()) return;

    setContent("");
    setImage(null);
    onSubmit(content, image);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "mb-4 mt-2 w-full rounded-[10px] px-4 py-[10px]",
        isThreadItem ? "bg-white" : "bg-fill-neutral-strong-default",
        className
      )}
    >
      <div className="flex w-full items-start gap-5 pb-4">
        <textarea
          id="reply-form-textarea"
          ref={textareaRef}
          placeholder={t("placeholder")}
          maxLength={500}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus={true}
          rows={1}
          className={cn(
            "flex-1 resize-none overflow-hidden pt-1",
            isThreadItem ? "bg-white" : "bg-fill-neutral-strong-default",
            "placeholder:text-body1-medium placeholder:text-neutral-strong-placeholder"
          )}
        />

        <div className="relative">
          {image && (
            <>
              <Image
                src={previewUrl}
                alt=""
                width={60}
                height={60}
                className="size-[60px] rounded-[16px] object-cover"
              />

              <div className="to-transparent absolute inset-0 rounded-[16px] bg-gradient-to-b from-black/10" />

              <button
                type="button"
                aria-label={t("deleteImageAriaLabel")}
                className="absolute right-1.5 top-1 z-10"
                onClick={() => setImage(null)}
              >
                <Icon name="XSecond" size={16} className="text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <p className="text-body2-regular text-neutral-strong-placeholder">{content.length}/500</p>

        <div className="gap-2 flex-center">
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <label
            htmlFor={inputId}
            aria-label={t("addImageAriaLabel")}
            className="size-11 cursor-pointer rounded-full bg-white flex-center"
          >
            <Icon name="Image" size={20} className="text-neutralInversed-normal-default" />
          </label>

          <Button
            aria-label={t("submitAriaLabel")}
            className="min-h-11 !min-w-[52px] rounded-full px-3"
            type="submit"
            disabled={disabled || isPending || !content.trim()}
          >
            {t("submit")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
