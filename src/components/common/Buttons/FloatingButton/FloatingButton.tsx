import { ButtonHTMLAttributes } from "react";
import Icon from "../../Icon/Icon";
import { cn } from "@/utils";

/**
 * 화면 우측 하단 등에 두고 쓰는 플로팅 액션 버튼(FAB)입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `disabled` 등 표준 `button` 속성과 함께 사용할 수 있습니다.
 * - 주로 새 글 작성·공지 작성 등 화면 이동이나 주요 액션 트리거에 씁니다.
 * - `mode`에 따라 내부 아이콘이 달라집니다. 게시 작성 흐름은 `post`, 공지 작성 흐름은 `notice`에 맞춥니다.
 *
 * @author hyungjun
 */
interface FloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 접근성용 `aria-label` (default: '플로팅 메뉴 버튼') */
  ariaLabel?: string;
  /** 버튼 루트 요소에 덧붙일 클래스 */
  buttonClassName?: string;
  /** 아이콘에 덧붙일 클래스 */
  iconClassName?: string;
  /** 용도별 표시 모드 (default: 'post') */
  mode?: "post" | "notice";
}

/**
 * @example
 * ```tsx
 * // 게시글 작성 화면으로 이동
 * <FloatingButton ariaLabel="게시글 작성" mode="post" onClick={() => router.push("/write/post")} />
 *
 * // 공지 작성 화면으로 이동
 * <FloatingButton ariaLabel="공지 작성" mode="notice" onClick={() => router.push("/admin/notice/write")} />
 * ```
 */

const FloatingButton = ({
  ariaLabel = "플로팅 메뉴 버튼",
  buttonClassName,
  iconClassName,
  mode = "post",
  ...props
}: FloatingButtonProps) => {
  const iconName = mode === "post" ? "FloatingPlus" : "Pencil";

  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "h-[70px] w-[70px] rounded-full p-3 transition-colors duration-150 flex-center",
        "border border-white bg-opacity-70 bg-fill-brand-strong-default",
        "hover:bg-fill-brand-strong-hover",
        "disabled:bg-fill-brand-strong-disabled",
        buttonClassName
      )}
      {...props}
    >
      <Icon name={iconName} size={32} className={iconClassName} />
    </button>
  );
};

export default FloatingButton;
