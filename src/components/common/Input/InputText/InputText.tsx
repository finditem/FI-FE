"use client";
"use no memo";

import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, useState } from "react";
import { cn } from "@/utils";
import { RegisterOptions, useFormContext } from "react-hook-form";
import DeleteButton from "../_internal/DeleteButton/DeleteButton";
import Label from "../_internal/Label/Label";
import Caption from "../_internal/Caption/Caption";
import Counter from "../_internal/Counter/Counter";
import { useFormInput } from "../_internal/_hooks/useFormInput";
import Button from "../../Buttons/Button/Button";
import Icon from "../../Icon/Icon";

/**
 * @author suhyeon
 *
 * 일반 텍스트, 비밀번호 입력 및 버튼 결합이 가능한 공통 Input 컴포넌트입니다.
 * `react-hook-form`의 `FormProvider` 하위에서 사용해야 하며, 실시간 검증을 위해 `mode: "onChange"` 설정을 권장합니다.
 *
 * @param props - InputText 컴포넌트 속성
 * @param props.inputOption - HTML Input 기본 속성 및 react-hook-form 설정 객체
 * - `name`: (필수) 폼 상태 관리를 위한 고유 식별자
 * - `type`: 입력 타입 (default: 'text')
 * - `validation`: `RegisterOptions` 형태의 유효성 검사 규칙
 * - `disabled`: 입력 필드 비활성화 여부
 * @param props.label - 필드 상단에 표시될 라벨 텍스트
 * @param props.btnOption - 우측 결합 버튼 설정 객체 (전달 시 버튼 렌더링)
 * - `btnLabel`: 버튼에 표시될 텍스트
 * - `btnOnClick`: 버튼 클릭 시 호출될 핸들러 (현재 입력값을 인자로 전달)
 * - `btnType`: 버튼의 HTML 타입 ('button', 'submit', 'reset')
 * @param props.caption - 하단 안내 문구 및 에러 메시지 설정 객체
 * - `isSuccess`: 성공 상태 표시 여부 (true 시 successMessage 노출)
 * - `successMessage`: 검증 성공 시 표시할 문구
 * - `rule`: 평상시 또는 검증 전 노출할 입력 규칙 문구
 *
 * @example
 * ```tsx
 * // 1. 기본 입력 필드 사용
 * <InputText
 * inputOption={{
 * name: "password",
 * type: "password",
 * validation: { required: "비밀번호는 필수입니다." }
 * }}
 * label="비밀번호"
 * caption={{ rule: "8~16자 영문, 숫자 조합" }}
 * />
 *
 * // 2. 버튼 결합형 사용
 * <InputText
 * inputOption={{ name: "email" }}
 * label="이메일"
 * btnOption={{
 * btnLabel: "중복확인",
 * btnOnClick: (value) => handleCheckEmail(value)
 * }}
 * />
 * ```
 *
 */

interface InputType extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?: string;
  validation?: RegisterOptions;
  disabled?: boolean;
}

interface InputButtonType extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnLabel?: string;
  btnOnClick?: (value: string) => void;
  btnType?: "button" | "submit" | "reset";
  loading?: boolean;
}

export interface InputTextProps {
  inputOption: InputType;
  label?: string;
  btnOption?: InputButtonType;
  caption?: {
    isSuccess?: boolean;
    successMessage?: string;
    rule?: string;
    timer?: number;
  };
}

const BASE_INPUT_STYLE = cn(
  "flex flex-1 w-full min-w-0 items-center relative h-11 py-3 px-2 bg-fill-neutral-strong-default rounded-[10px] text-body1-regular text-neutral-strong-entered",
  "placeholder:text-neutral-strong-placeholder hover:text-neutral-strong-hover border focus:outline-none focus:text-neutral-strong-focused",
  "disabled:text-neutral-strong-disabled disabled:bg-fill-neutral-strong-disabled autofill:text-neutral-strong-default",
  "autofill:shadow-[inset_0_0_0px_1000px_#f5f5f5] autofill:disabled:shadow-[inset_0_0_0px_1000px_#f5f5f5]"
);

const InputText = ({
  inputOption = { name: "" },
  label,
  btnOption = {},
  caption = {},
}: InputTextProps) => {
  const { name, type = "text", validation, disabled } = inputOption;
  const { btnType = "button", btnOnClick, btnLabel, ...restBtnOption } = btnOption;
  const { isSuccess, successMessage, rule, timer } = caption;

  const {
    register,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useFormContext();

  const { onDelete } = useFormInput();

  const isValue = watch(name)?.trim();
  const isValueStr = (isValue ?? "").toString();

  const isPasswordType = type === "password";
  const togglePassword = isPasswordType;
  const [show, setShow] = useState(false);

  const actualType = isPasswordType ? (show ? "text" : "password") : type;

  const maxLength =
    typeof validation?.maxLength === "number" ? validation.maxLength : validation?.maxLength?.value;

  const showError = !!errors?.[name] && (touchedFields?.[name] || dirtyFields?.[name]);

  return (
    <div className="flex w-full flex-col gap-2">
      {/* label */}
      <Label
        name={name}
        label={label}
        required={!!validation?.required}
        className="text-body2-medium text-layout-header-default"
      />

      <div className="flex w-full flex-row gap-2">
        <div className="relative flex flex-1 flex-row">
          <input
            id={name}
            {...register(name, validation)}
            className={cn(
              BASE_INPUT_STYLE,
              isValue && "pr-8",
              togglePassword && "pr-[60px]",
              showError && "border border-system-warning"
            )}
            disabled={disabled}
            {...inputOption}
            type={actualType}
          />

          {/* 삭제 버튼 */}
          {disabled ||
            (!!isValue && (
              <DeleteButton
                eyeShow={togglePassword}
                className="top-1/2 -translate-y-1/2"
                value={isValue}
                onDelete={() => onDelete(name)}
              />
            ))}

          {/* 비밀번호 눈 모양 버튼 */}
          {togglePassword && (
            <button
              className="absolute right-2 top-3 outline-none flex-center"
              type="button"
              tabIndex={-1}
              aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShow((prev) => !prev)}
            >
              <Icon
                name={show ? "EyeOpen" : "EyeOff"}
                className="text-neutral-strong-enteredSelected"
                size={16}
              />
            </button>
          )}
        </div>

        {/* with Button */}
        {btnLabel && (
          <Button
            variant="outlined"
            type={btnType}
            onClick={() => btnOnClick?.(isValue)}
            disabled={disabled}
            size="big"
            className="flex h-11 w-fit flex-shrink-0 whitespace-nowrap px-5 py-[10px]"
            {...restBtnOption}
          >
            {btnLabel}
          </Button>
        )}
      </div>

      {/* 안내 문구 */}
      <div className="flex w-full justify-between text-caption1-regular text-layout-body-default">
        <Caption
          isSuccess={isSuccess}
          successMessage={successMessage}
          hasError={!!errors[name]}
          errorMessage={errors[name]?.message as string}
          rule={rule}
        />

        {/* 글자 수 확인 */}
        <Counter isLength={isValueStr.length} maxLength={maxLength} />

        {/* 타이머 */}
        {timer && timer > 0 && (
          <time className="text-caption1-regular text-brand-normal-default">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </time>
        )}
      </div>
    </div>
  );
};

export default InputText;
