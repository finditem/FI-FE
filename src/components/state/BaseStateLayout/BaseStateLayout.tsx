import { ReactNode } from "react";
import { cn } from "@/utils";

/**
 * 공통 state 컴포넌트의 레이아웃을 담당합니다.
 *
 * @remarks
 * - `flex-col-center`를 기본으로 적용합니다.
 *
 * @author jikwon
 */
interface BaseStateLayoutProps {
  /** state 컴포넌트의 자식 요소 */
  children: ReactNode;
  /** 추가 클래스 */
  className?: string;
}

/**
 * @example
 * ```tsx
 * <BaseStateLayout>
 *   <p>데이터가 없습니다.</p>
 * </BaseStateLayout>
 * ```
 */

const BaseStateLayout = ({ children, className }: BaseStateLayoutProps) => {
  return (
    <div className={cn("h-full w-full gap-5 py-20 flex-col-center", className)}>{children}</div>
  );
};

export default BaseStateLayout;
