import { ButtonHTMLAttributes, ReactNode } from "react";
import Icon from "../../Icon/Icon";

/**
 * @author hyungjun
 *
 * 상세 위치 보기 버튼 컴포넌트입니다.
 * 버튼 내부에 위치 아이콘과 화살표 아이콘을 포함하며,
 * 텍스트를 표시할 수 있습니다.
 *
 * @param children - 버튼에 표시할 텍스트 또는 요소입니다.
 *
 * @param ariaLabel - 접근성을 위한 버튼 라벨 텍스트입니다. (기본값: `"상세 위치 보기"`)
 *
 * @example
 * ```tsx
 * <Location ariaLabel="위치 보기" onClick={() => console.log('위치 클릭')}>
 *   서울 강남구
 * </Location>
 * ```
 */

interface LocationProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  ariaLabel?: string;
}

const Location = ({ children, ariaLabel = "상세 위치 보기", ...props }: LocationProps) => {
  return (
    <button
      {...props}
      className="active:text-neutral-normal-pressed flex items-center gap-[5px] text-sm text-neutral-normal-default transition-colors duration-150 hover:text-black disabled:text-neutral-normal-disabled"
      aria-label={ariaLabel}
    >
      <Icon name="Location" size={16} />
      <span>{children}</span>
      <Icon name="ArrowRightSmall" size={18} className="ml-[1px] text-neutral-normal-hover" />
    </button>
  );
};

export default Location;
