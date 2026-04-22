import { cn } from "@/utils";

/**
 * 필수 입력 항목을 나타내는 별표(`*`) 컴포넌트입니다.
 *
 * @author jikwon
 */

interface RequiredTextProps {
  /** 추가 클래스 */
  className?: string;
}

/**
 * @example
 * ```tsx
 * <label>이름 <RequiredText /></label>
 * ```
 */

const RequiredText = ({ className }: RequiredTextProps) => {
  return <span className={cn("text-flatGreen-500", className)}>*</span>;
};

export default RequiredText;
