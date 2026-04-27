import { ButtonHTMLAttributes, ReactNode } from "react";
import Icon from "../../Icon/Icon";

/**
 * 장소·주소 등 상세 위치로 이어지는 링크형 액션에 쓰는 버튼입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `disabled` 등 표준 `button` 속성과 함께 사용할 수 있습니다.
 * - 앞쪽 `Location`, 뒤쪽 `ArrowRightSmall` 아이콘 사이에 `children` 텍스트가 옵니다.
 * - `className` 등을 넘기면 기본 유틸 클래스 뒤에 이어 붙는 형태가 아니라, 현재 구현은 고정 `className`만 사용합니다.
 *
 * @author hyungjun
 */

interface LocationProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 주소·지역명 등 버튼 가운데에 보일 콘텐츠 */
  children: ReactNode;
  /** 접근성용 `aria-label` (default: '상세 위치 보기') */
  ariaLabel?: string;
}

/**
 * @example
 * ```tsx
 * <Location ariaLabel="위치 보기" onClick={() => console.log("위치 클릭")}>
 *   서울 강남구
 * </Location>
 * ```
 */

const Location = ({ children, ariaLabel = "상세 위치 보기", ...props }: LocationProps) => {
  return (
    <button
      {...props}
      className="flex items-center gap-[5px] text-sm text-neutral-normal-default transition-colors duration-150 hover:text-black active:text-neutral-normal-pressed disabled:text-neutral-normal-disabled"
      aria-label={ariaLabel}
    >
      <Icon name="Location" size={16} />
      <span>{children}</span>
      <Icon name="ArrowRightSmall" size={18} className="ml-[1px] text-neutral-normal-hover" />
    </button>
  );
};

export default Location;
