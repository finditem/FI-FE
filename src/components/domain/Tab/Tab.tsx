import { cn } from "@/utils";

/**
 * 탭 컴포넌트입니다.
 *
 * @author jikwon
 */

interface TabProps<T extends string> {
  /** 탭 목록. `key`는 탭 식별자, `label`은 표시 텍스트입니다. */
  tabs: ReadonlyArray<{ key: T; label: string }>;
  /** 현재 선택된 탭의 key */
  selected: T;
  /** 탭 선택 시 호출되는 콜백 */
  onValueChange: (key: T) => void;
  /** 추가 클래스 (default: '') */
  className?: string;
}

/**
 * @example
 * ```tsx
 * <Tab
 *   tabs={[{ key: "tab1", label: "Tab 1" }, { key: "tab2", label: "Tab 2" }]}
 *   selected="tab1"
 *   onValueChange={(key) => console.log(key)}
 * />
 * ```
 */

const Tab = <T extends string>({
  tabs,
  selected,
  onValueChange,
  className,
  ...buttonProps
}: TabProps<T>) => {
  return (
    <div
      className={cn(
        "z-10 flex w-full border-b border-divider-default bg-white px-[20px]",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          {...buttonProps}
          className={cn(
            "h-[60px] flex-1 text-h3-semibold text-flatGray-300 flex-center",
            selected === tab.key && "border-b-2 border-flatGreen-500 text-flatGreen-500"
          )}
          onClick={() => onValueChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tab;
