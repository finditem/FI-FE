import { Icon } from "@/components/common";
import { IconName } from "@/components/common/Icon/Icon";
import BaseStateLayout from "../BaseStateLayout/BaseStateLayout";

/**
 * 데이터가 없을 때 표시하는 state 컴포넌트입니다.
 *
 * @remarks
 * - `BaseStateLayout`을 사용하여 공통 레이아웃을 적용합니다.
 *
 * @author jikwon
 */
interface EmptyStateProps {
  /** 아이콘 정보 */
  icon: {
    iconName: IconName;
    iconSize: number;
    iconColor?: string;
  };
  /** 제목 */
  title?: string;
  /** 설명 */
  description?: string;
  /** 추가 클래스 */
  className?: string;
}

/**
 * @example
 * ```tsx
 * <EmptyState
 *   icon={{ iconName: "Empty", iconSize: 50 }}
 *   title="데이터가 없습니다."
 *   description="데이터가 없습니다."
 * />
 * ```
 */

const EmptyState = ({ icon, title, description, className }: EmptyStateProps) => {
  const { iconName, iconSize, iconColor } = icon;

  return (
    <BaseStateLayout className={className}>
      <Icon name={iconName} size={iconSize} className={iconColor} />
      {title && <p className="text-h2-bold text-layout-header-default">{title}</p>}
      {description && (
        <p className="whitespace-pre-line text-center text-body2-regular text-layout-body-default">
          {description}
        </p>
      )}
    </BaseStateLayout>
  );
};

export default EmptyState;
