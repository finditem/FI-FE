"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

/**
 * 탭 컴포넌트입니다.
 *
 * @remarks
 * - 선택 표시 밑줄은 `framer-motion`의 `layoutId` 공유 레이아웃 애니메이션으로, 탭을 바꾸면
 *   이전 탭에서 새 탭으로 슬라이드하며 이동합니다.
 * - 한 화면에 Tab이 여러 개 있어도 밑줄이 서로 간섭하지 않도록 `useId`로 인스턴스별 고유
 *   `layoutId`를 부여합니다.
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
  const underlineLayoutId = useId();

  return (
    <div
      className={cn(
        "z-10 flex w-full border-b border-divider-default bg-white px-[20px]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isSelected = selected === tab.key;

        return (
          <button
            key={tab.key}
            {...buttonProps}
            className={cn(
              "relative h-[60px] flex-1 text-h3-semibold flex-center",
              isSelected ? "text-brand-normal-default" : "text-system-unselected"
            )}
            onClick={() => onValueChange(tab.key)}
            type="button"
          >
            {tab.label}
            {isSelected && (
              <motion.span
                layoutId={underlineLayoutId}
                className="bg-brand-normal-default absolute inset-x-0 bottom-0 h-[2px]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tab;
