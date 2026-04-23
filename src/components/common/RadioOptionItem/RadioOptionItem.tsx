import { InputHTMLAttributes } from "react";
import { cn } from "@/utils";

/**
 * 라디오 그룹의 개별 옵션 아이템 컴포넌트입니다.
 *
 * @remarks
 * - `option.value`와 `selected`를 비교해 선택 상태를 판단합니다.
 * - controlled 방식으로 동작합니다.
 *
 * @author jikwon
 */

type RadioOption = {
  value: string;
  label: string;
};

interface RadioOptionItemProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "value" | "checked" | "onChange"
> {
  /** 라디오 옵션 객체 (value, label) */
  option: RadioOption;
  /** 현재 선택된 값 */
  selected: string;
  /** 선택 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 라디오 그룹 이름 (`name` 어트리뷰트에 사용) */
  inputName: string;
  /** 최상위 `label` 요소에 적용할 클래스 */
  labelClassName?: string;
}

/**
 * @example
 * ```tsx
 * <RadioOptionItem
 *   option={{ value: "FOOD", label: "음식" }}
 *   selected={selected}
 *   onChange={setSelected}
 *   inputName="category"
 * />
 * ```
 */

const RadioOptionItem = ({
  option,
  selected,
  onChange,
  inputName,
  labelClassName,
  ...inputProps
}: RadioOptionItemProps) => {
  const { value, label } = option;
  const isChecked = selected === value;

  return (
    <label
      className={cn(
        "flex h-[61px] w-full cursor-pointer items-center gap-3 px-5 py-[18px] text-h3-medium text-neutral-normal-default",
        isChecked && "rounded-[4px] bg-fill-neutral-strong-default",
        labelClassName
      )}
    >
      <input
        type="radio"
        name={inputName}
        value={value}
        checked={isChecked}
        onChange={(e) => onChange(e.target.value)}
        className="peer hidden"
        {...inputProps}
      />
      <span
        className={cn(
          "relative h-4 w-4 rounded-full border border-neutral-normal-default peer-checked:border-brand-normal-enteredSelected",
          "before:absolute before:inset-[3px] before:scale-0 before:rounded-full before:transition-transform before:bg-fill-brand-normal-enteredSelected",
          "peer-checked:before:scale-100"
        )}
      />
      <span>{label}</span>
    </label>
  );
};

export default RadioOptionItem;
