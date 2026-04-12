"use client";
"use no memo";

import { InputHTMLAttributes, KeyboardEvent } from "react";
import Icon from "../../Icon/Icon";
import { useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import DeleteButton from "../_internal/DeleteButton/DeleteButton";

/**
 * @author suhyeon
 *
 * 검색을 위한 input 공통 컴포넌트 입니다.
 * react-hook-form와 onChange 두 가지의 방식을 사용하실 수 있도록 유연하게 개발하였습니다.
 * react-hook-form으로 사용하실 곳은 상위 요소로 FormProvider를 사용해주시고 method는 onChange 모드로 설정하시면 됩니다.
 *
 *
 * @param items - 검색 입력창의 props입니다.
 *  - 'name': 입력 필드의 id 및 register함수 사용을 위한 name
 *  - `mode`: react-hook-from모드와 onChange모드 중 하나를 선택한다는 걸 InputSearch에 알려줍니다.
 *  - `validation`: 입력 필드의 유효성 검사를 위한 RegisterOption입니다. (기본적으로는 name만 사용하셔도 무방하지만 혹시모르기에 props로 추가해두었습니다.)
 *  - 'onEnter': 엔터 키 클릭 함수
 *  - 'defaultValue': 입력 필드의 기본값입니다. onChange 모드에서 사용됩니다.
 *
 *
 * @example onChange 모드 사용 (독립형)
 * ```tsx
 *     <InputSearch
 *       name="keyword"
 *       mode="onChange"
 *       placeholder="검색어 입력"
 *       onEnter={(v)=> console.log(v)}
 *     />
 * ```
 *
 * @example react-hook-form모드
 * ```tsx
 * <FormProvider {...methods}>
 *   <form onSubmit={methods.handleSubmit(onSubmit)}>
 *     <InputSearch
 *       name="search"
 *       validation={{required: true}}
 *       onEnter={(v) => console.log("엔터로 검색")}
 *     />
 *   </form>
 * </FormProvider>
 * ```
 */

interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mode: "RHF" | "onChange";
  validation?: RegisterOptions;
  onEnter?: (value: string) => void;
}

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
