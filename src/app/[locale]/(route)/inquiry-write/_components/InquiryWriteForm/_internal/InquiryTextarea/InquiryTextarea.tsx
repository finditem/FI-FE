"use client";

import { TextareaHTMLAttributes } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface InquiryTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

const PLACEHOLDER =
  "이용하며 느끼신 불편한 점이나 바라는 점을 알려주세요. 문의 답변은 이메일 또는 고객센터>문의 내역에서 확인 가능합니다. 내용 본문과 이미지에 고객님에 개인 정보 (주민번호 등)가 포함되지 않도록 주의해주세요.";

const InquiryTextarea = ({ name, ...props }: InquiryTextareaProps) => {
  const { register, control, setValue } = useFormContext();
  const inputValue = useWatch({ control, name });

  return (
    <div className="px-7">
      <textarea
        className="h-[300px] w-full resize-none text-body1-regular text-layout-header-default placeholder:text-body1-regular placeholder:text-labelsVibrant-tertiary"
        {...register(name)}
        placeholder={PLACEHOLDER}
        {...props}
      />
    </div>
  );
};

export default InquiryTextarea;
