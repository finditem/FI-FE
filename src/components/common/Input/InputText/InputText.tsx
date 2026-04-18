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
 * 일반 텍스트, 비밀번호 입력 및 버튼 결합이 가능한 공통 Input 컴포넌트입니다.
 *
 * @remarks
 * - `react-hook-form`의 `FormProvider` 하위에서 사용해야 합니다.
 * - 실시간 검증을 위해 `mode: "onChange"` 설정 및 "use no memo"가 필요할 수 있습니다.
 *
 * @author suhyeon
 */

interface InputType extends InputHTMLAttributes<HTMLInputElement> {
  /** 폼 상태 관리를 위한 고유 식별자 (필수) */
  name: string;
  /** 입력 필드의 타입 (default: 'text') */
  type?: string;
  /** `react-hook-form`의 유효성 검사 규칙 객체 */
  validation?: RegisterOptions;
  /** 입력 필드 비활성화 여부 */
  disabled?: boolean;
}

interface InputButtonType extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 텍스트 */
  btnLabel?: string;
  /** 버튼 클릭 핸들러 (현재 input의 value를 인자로 전달받음) */
  btnOnClick?: (value: string) => void;
  /** 버튼의 HTML 타입 */
  btnType?: "button" | "submit" | "reset";
  /** 버튼의 로딩 상태 표시 여부 */
  loading?: boolean;
}

export interface InputTextProps {
  /** 입력 필드 설정 객체 */
  inputOption: InputType;
  /** 필드 상단에 표시될 라벨 */
  label?: string;
  /** 우측 결합 버튼 설정 객체 */
  btnOption?: InputButtonType;
  /** 하단 안내 문구 설정 객체 */
  caption?: {
    /** 성공(초록색) 상태 표시 여부 */
    isSuccess?: boolean;
    /** 성공 상태일 때 노출될 메시지 */
    successMessage?: string;
    /** 기본 가이드라인 또는 입력 규칙 메시지 */
    rule?: string;
    /** 우측 하단에 표시될 제한 시간(초) */
    timer?: number;
  };
}

/**
 * @example
 * ```tsx
 * // 1. 비밀번호 입력 (검증 규칙 포함)
 * <InputText
 *   inputOption={{
 *     name: "password",
 *     type: "password",
 *     validation: { required: "비밀번호는 필수입니다." }
 *   }}
 *   label="비밀번호"
 *   caption={{ rule: "8~16자 영문, 숫자 조합" }}
 * />
 *
 * // 2. 버튼 결합형 (이메일 중복 확인 등)
 * <InputText
 *   inputOption={{ name: "email" }}
 *   label="이메일"
 *   btnOption={{
 *     btnLabel: "중복확인",
 *     btnOnClick: (value) => handleCheckEmail(value)
 *   }}
 * />
 *
 * // 3. validation을 통한 입력 제한 및 우측 하단 최대 텍스트 안내
 * <InputText
 *   inputOption={{
 *     name: "nickname",
 *     maxLength: 10, // 최대 텍스트 입력 안내 (실시간 텍스트 수 체크)
 *     validation: {
 *       required: "닉네임을 입력해 주세요.",
 *       pattern: {
 *         value: /^[a-zA-Z0-9가-힣]+$/,
 *         message: "자음·모음 및 특수문자는 입력할 수 없습니다.",
 *       },
 *       minLength: {
 *         value: 2,
 *         message: "2~10자 사이의 닉네임을 입력해 주세요.",
 *       },
 *       maxLength: {
 *         value: 10,
 *         message: "2~10자 사이의 닉네임을 입력해 주세요.",
 *       },
 *     },
 *   }}
 *   label="닉네임"
 *   btnOption={{
 *     btnLabel: "중복 확인",
 *     btnOnClick: (value) => handleCheckNickname(value),
 *   }}
 * />
 * ```
 */

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

          {/* delete button */}
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

      {/* caption */}
      <div className="flex w-full justify-between text-caption1-regular text-layout-body-default">
        <Caption
          isSuccess={isSuccess}
          successMessage={successMessage}
          hasError={!!errors[name]}
          errorMessage={errors[name]?.message as string}
          rule={rule}
        />

        {/* text counter */}
        <Counter isLength={isValueStr.length} maxLength={maxLength} />

        {/* timer */}
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
