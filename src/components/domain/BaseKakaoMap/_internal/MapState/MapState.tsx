import { ReactNode } from "react";
import { Icon } from "@/components/common";
import { cn } from "@/utils";

/**
 * 지도 상태(로딩/에러) 화면의 공통 레이아웃 컴포넌트입니다.
 *
 * @author jikwon
 */

type StateLayoutProps = {
  /** 상태를 나타내는 아이콘 요소 */
  icon: ReactNode;
  /** 상태 제목 */
  title: ReactNode;
  /** 부가 설명 콘텐츠 */
  children?: ReactNode;
  /** 콘텐츠 영역에 적용할 추가 클래스 */
  contentClassName: string;
};

const StateLayout = ({ icon, title, children, contentClassName }: StateLayoutProps) => {
  return (
    <section className="h-full w-full bg-flatGray-25 flex-col-center">
      <div className={cn("min-h-[162px] min-w-[181px] flex-col-center", contentClassName)}>
        <div className="gap-2 flex-col-center">
          {icon}
          <span className="text-h2-bold text-layout-header-default">{title}</span>
        </div>

        {children}
      </div>
    </section>
  );
};

/**
 * 카카오 지도 SDK 로딩 중 표시되는 상태 컴포넌트입니다.
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * <MapLoadingState />
 * ```
 */

const MapLoadingState = () => {
  return (
    <StateLayout
      icon={
        <Icon name="LogoCharacterOutlined" size={70} className="text-labelsVibrant-quaternary" />
      }
      title="페이지 로딩 중입니다."
      contentClassName="gap-8"
    >
      <Icon name="Loading" className="animate-spin" size={30} />
    </StateLayout>
  );
};

/**
 * 카카오 지도 로드 실패 시 표시되는 에러 상태 컴포넌트입니다.
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * <MapErrorState />
 * ```
 */

const MapErrorState = () => {
  return (
    <StateLayout
      icon={<Icon name="AlertState" size={70} />}
      title="지도를 표시할 수 없습니다."
      contentClassName="gap-5"
    >
      <span className="text-center text-body2-regular text-layout-body-default">
        일시적인 서비스 오류가 발생했습니다. <br />
        잠시 후 다시 시도해 주세요.
      </span>
    </StateLayout>
  );
};

export { MapLoadingState, MapErrorState };
