"use client";
"use no memo";

import { InputHTMLAttributes, KeyboardEvent } from "react";
import Icon from "../../Icon/Icon";
import { useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import DeleteButton from "../_internal/DeleteButton/DeleteButton";

/**
 * 검색을 위한 공통 입력 컴포넌트입니다.
 *
 * @remarks
 * - **RHF 모드**: `FormProvider` 하위에서 사용하며, `react-hook-form` 상태와 연동됩니다.
 * - **onChange 모드**: 내부 state로 값을 관리하는 독립형 컴포넌트입니다.
 * - RHF 모드일땐 `react-hook-form`의 `mode: "onChange"` 설정을 권장합니다.
 *
 * @author suhyeon
 */

interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 폼 상태 관리 또는 필드 식별을 위한 고유 이름 (필수) */
  name: string;
  /**
   * 컴포넌트 작동 모드 선택 (필수)
   * - `RHF`: react-hook-form 연동 모드
   * - `onChange`: 내부 state 기반 독립 모드
   */
  mode: "RHF" | "onChange";
  /** [RHF 전용] 유효성 검사 규칙 객체 */
  validation?: RegisterOptions;
  /** 엔터 키를 눌렀을 때 실행될 검색 핸들러 (현재 입력값을 인자로 전달) */
  onEnter?: (value: string) => void;
}

/**
 * @example
 * // 1. onChange 모드 (독립형)
 * <InputSearch
 *   name="keyword"
 *   mode="onChange"
 *   placeholder="검색어 입력"
 *   onEnter={(value) => handleSearch(value)}
 * />
 *
 * // 2. RHF 모드 (React Hook Form 연동)
 * <InputSearch
 *   name="search"
 *   mode="RHF"
 *   validation={{ required: "검색어를 입력해주세요." }}
 *   onEnter={(value) => console.log("검색어:", value)}
 * />
 */

const BASE_STYLE =
  "h-11 min-w-0 flex-1 rounded-[24px] border px-10 text-body1-regular outline-none bg-fill-neutral-subtle-default placeholder:text-neutral-normal-placeholder hover:text-neutral-normal-hover focus:text-neutral-normal-focused";

// RHF 모드용 컴포넌트
const InputSearchRHF = ({
  name,
  validation,
  onEnter,
  ...props
}: Omit<InputSearchProps, "mode">) => {
  const { register, watch, setValue } = useFormContext();
  const rhfValue = watch(name) || "";

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    onEnter?.(rhfValue);
  };

  return (
    <div className="relative flex w-full flex-row gap-2">
      <Icon
        name="Search"
        size={16}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-normal-placeholder"
      />

      <input
        id={name}
        {...register(name, validation)}
        {...props}
        className={BASE_STYLE}
        onKeyDown={handleKeyDown}
      />

      <InputSearchDeleteButton value={rhfValue} onDelete={() => setValue(name, "")} />
    </div>
  );
};

// onChange 모드용 컴포넌트
const InputSearchOnChange = ({
  name,
  onEnter,
  defaultValue,
  ...props
}: Omit<InputSearchProps, "mode" | "validation">) => {
  const [innerValue, setInnerValue] = useState(defaultValue ? String(defaultValue) : "");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    onEnter?.(innerValue);
  };

  return (
    <div className="relative flex w-full flex-row gap-2">
      <Icon
        name="Search"
        size={16}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-normal-placeholder"
      />

      <input
        id={name}
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        {...props}
        className={BASE_STYLE}
        onKeyDown={handleKeyDown}
      />

      <InputSearchDeleteButton value={innerValue} onDelete={() => setInnerValue("")} />
    </div>
  );
};

// 삭제 버튼 컴포넌트
const InputSearchDeleteButton = ({ value, onDelete }: { value: string; onDelete: () => void }) => {
  return (
    value && (
      <DeleteButton
        value={value}
        className="right-5 top-1/2 -translate-y-1/2"
        onDelete={onDelete}
      />
    )
  );
};

// 메인 컴포넌트
const InputSearch = ({ mode, ...props }: InputSearchProps) => {
  return mode === "RHF" ? <InputSearchRHF {...props} /> : <InputSearchOnChange {...props} />;
};

export default InputSearch;
