"use client";
"use no memo";

import { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils";
import { RegisterOptions, useFormContext, useWatch } from "react-hook-form";
import DeleteButton from "../_internal/DeleteButton/DeleteButton";
import Label from "../_internal/Label/Label";
import Caption from "../_internal/Caption/Caption";
import Counter from "../_internal/Counter/Counter";
import { useFormInput } from "../_internal/_hooks/useFormInput";

/**
 * 서술형 텍스트를 작성할 수 있는 input 공통 컴포넌트 입니다.
 *
 * @remarks
 * - `react-hook-form`의 `FormProvider` 하위에서 사용해야 합니다.
 * - 실시간 검증을 위해 `mode: "onChange"` 설정 및 "use no memo"가 필요할 수 있습니다.
 *
 * @author suhyeon
 */

interface InputFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 폼 상태 관리를 위한 고유 식별자 (필수) */
  name: string;
  /** 필드 상단에 표시될 라벨 */
  label?: string;
  /** 기본 가이드라인 또는 입력 규칙 메시지 */
  rule?: string;
  /** `react-hook-form`의 유효성 검사 규칙 객체 */
  validation?: RegisterOptions;
}

/**
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <form onSubmit={methods.handleSubmit(onSubmit)}>
 *     <InputField
 *       name="test"
 *       validation={{maxLength: {value: 30, message: "30자 이내로 입력해주세요."}}}
 *       label="테스트"
 *       rule="2~30자 이내로 입력해주세요."
 *     />
 *   </form>
 * </FormProvider>
 * ```
 */

const InputField = ({
  name,
  label,
  validation,
  rule,
  maxLength: maxLengthProp,
  ...props
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { onDelete } = useFormInput();

  const isValue = useWatch({ name }) ?? "";
  const isValueStr = (isValue ?? "").toString();

  const maxLengthFromValidation =
    typeof validation?.maxLength === "number" ? validation.maxLength : validation?.maxLength?.value;
  const maxLength = maxLengthFromValidation ?? maxLengthProp;

  return (
    <div className="flex w-full flex-col gap-1">
      <Label name={name} label={label} className="text-body2-regular text-layout-body-default" />

      <div className="relative">
        <textarea
          id={name}
          {...props}
          className={cn(
            "text-body4-regular h-[120px] w-full resize-none rounded-[10px] border border-neutral-normal-default p-3 pr-9",
            "hover:border-neutral-normal-hover focus:border-neutral-normal-focused disabled:border-neutral-normal-disabled disabled:bg-fill-neutral-normal-disabled",
            !!errors[name] && "!border-system-warning",
            isValue && "focus:border-neutral-normal-focused"
          )}
          {...register(name, validation)}
          maxLength={maxLength}
        />

        {/* 삭제 버튼 */}
        <DeleteButton
          value={isValue}
          className="right-[14px] top-[14px]"
          onDelete={() => onDelete(name)}
        />
      </div>

      {/* 안내 문구 */}
      <div className="flex w-full justify-between text-caption1-regular text-layout-body-default">
        <Caption
          hasError={!!errors[name]}
          errorMessage={errors[name]?.message as string}
          rule={rule}
        />

        {/* 글자 수 확인 */}
        <Counter isLength={isValueStr.length} maxLength={maxLength} />
      </div>
    </div>
  );
};

export default InputField;
