"use client";

import { cn } from "@/utils";
import Icon from "../../Icon/Icon";
import { Props } from "@/components/common/Icon/Icon";

/**
 * 케밥 메뉴에서 한 행(버튼)에 해당하는 설정입니다.
 *
 * @remarks
 * - `loading`이면 스피너만 보이고 텍스트·아이콘은 렌더하지 않습니다.
 * - `icon`이 있으면 `iconPosition`으로 텍스트 기준 앞·뒤에 둡니다(`icon`이 있을 때만, default: 'leading').
 * - `type`을 생략하면 행 버튼은 `submit`으로 렌더됩니다. 폼 내부에서는 의도치 않은 제출이 없는지 확인하세요.
 */
interface KebabMenuItem {
  /** 행에 표시할 라벨 텍스트 */
  text: string;
  /** 함께 표시할 아이콘에 넘길 `Icon` 설정 */
  icon?: Props;
  /** 아이콘을 텍스트 기준 앞·뒤 배치 (`icon`이 있을 때만, default: 'leading') */
  iconPosition?: "leading" | "trailing";
  /** 로딩 시 스피너 표시 및 비활성 */
  loading?: boolean;
  /** 비활성 여부 */
  disabled?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 접근성용 라벨 */
  ariaLabel?: string;
  /** 텍스트 색·호버 등 Tailwind 텍스트 유틸 클래스(미지정 시 기본 팔레트) */
  textColor?: string;
  /** 행 버튼의 HTML `type` (default: 'submit') */
  type?: "submit" | "button" | "reset";
}

/**
 * 카드형으로 세로 나열한 케밥(⋯) 메뉴입니다.
 *
 * @remarks
 * - 이 파일은 `"use client"`이므로 `onClick` 등 상호작용이 있는 항목은 클라이언트 컴포넌트 트리에서 쓰세요.
 *
 * @author hyungjun
 */
interface KebabMenuProps {
  /** 위에서 아래 순으로 렌더할 메뉴 행 설정 */
  items: KebabMenuItem[];
}

const DEFAULT_TEXT_COLOR =
  "text-neutral-normal-default hover:text-black active:text-neutral-normal-pressed disabled:text-neutral-normal-disabled";

/**
 * @example
 * ```tsx
 * <KebabMenu
 *   items={[
 *     { text: "편집", icon: { name: "Edit" }, onClick: handleEdit },
 *     { text: "삭제", icon: { name: "Trash" }, onClick: handleDelete, disabled: true },
 *     { text: "복사", icon: { name: "Copy" }, loading: true },
 *     { text: "텍스트만", textColor: "text-yellow-500", type: "button" },
 *   ]}
 * />
 * ```
 */

const KebabMenu = ({ items }: KebabMenuProps) => {
  const finalIconPosition = (item: KebabMenuItem) => item.icon && (item.iconPosition ?? "leading");
  const finalTextColor = (item: KebabMenuItem) => item.textColor ?? DEFAULT_TEXT_COLOR;

  return (
    <div className="grid w-max auto-cols-auto grid-flow-row">
      {items.map((item, index) => (
        <button
          key={index}
          disabled={item.disabled || item.loading}
          onClick={item.onClick}
          type={item.type ?? "submit"}
          className={cn(
            "glass-card glass-card::before glass-card::after grid auto-cols-max grid-flow-col items-center justify-center gap-2 border-b border-white px-7 py-4 text-h3-medium transition-colors duration-150 bg-fill-neutral-subtle-default",
            finalTextColor(item),
            "active:bg-fill-neutral-subtle-pressed",
            "disabled:bg-fill-neutral-subtle-disabled",
            index === 0 && "rounded-t-[20px]",
            items.length === ++index && "rounded-b-[20px]"
          )}
        >
          {item.loading ? (
            <Icon name="Loading" className="animate-spin" />
          ) : (
            finalIconPosition(item) === "leading" && item.icon && <Icon {...item.icon} />
          )}
          {!item.loading && item.text}
          {!item.loading && finalIconPosition(item) === "trailing" && item.icon && (
            <Icon {...item.icon} />
          )}
        </button>
      ))}
    </div>
  );
};

export default KebabMenu;
