"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common";
import { cn } from "@/utils";

/**
 * 상세·작성 등 화면 상단에 두는 고정 헤더입니다.
 *
 * @remarks
 * - `"use client"`이며 `next/navigation`의 `useRouter`로 뒤로가기 동작을 처리합니다.
 * - `onBack`이 있으면 뒤로 버튼은 그만 호출하고, 없으면 `sessionStorage`의 `__fmi_history_count`를 보고 `router.back()` 또는 `/`로 이동합니다.
 * - `fixed` 헤더 아래 콘텐츠가 가리지 않도록 동일 높이의 자리 표시 `div`를 둡니다.
 * - 오른쪽 액션은 `DetailHeaderParts`(저장, 검색, 즐겨찾기, 메뉴 등)를 `children`으로 넣는 패턴을 씁니다.
 *
 * @author hyungjun
 */

interface DetailHeaderProps {
  /** 헤더 중앙 제목(없거나 빈 값이면 제목 영역을 렌더하지 않음) */
  title?: ReactNode;
  /** 헤더 오른쪽 액션 슬롯 */
  children?: ReactNode;
  /** 뒤로 버튼 클릭 시 직접 처리할 때 전달(없으면 라우터 기본 뒤로/홈) */
  onBack?: () => void;
}

const HEADER_HEIGHT = "h-14";

/**
 * @example
 * ```tsx
 * import { DetailHeader } from "@/components/layout";
 * import { DetailHeaderSave } from "@/components/layout/DetailHeader/DetailHeaderParts";
 *
 * <DetailHeader title="자주 묻는 질문" />
 *
 * <DetailHeader title="글쓰기">
 *   <DetailHeaderSave onClick={handleSave} />
 * </DetailHeader>
 *
 * <DetailHeader title="게시글 상세">
 *   <DetailHeaderStar isActive />
 *   <DetailHeaderMenu onClick={handleMenu} />
 * </DetailHeader>
 * ```
 */

const DetailHeader = ({ title = "", children, onBack }: DetailHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (typeof window !== "undefined") {
      const historyCount = parseInt(sessionStorage.getItem("__fmi_history_count") || "0", 10);
      if (historyCount > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-30 mx-auto flex h-14 w-full max-w-[764px] items-center justify-between bg-white px-5",
          HEADER_HEIGHT
        )}
      >
        <div className="flex items-center gap-2">
          <button
            className="h-[30px] w-[30px]"
            type="button"
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <Icon name="ArrowLeftSmall" size={30} className="text-neutral-strong-default" />
          </button>
          {title && <h2 className="text-xl font-semibold text-layout-header-default">{title}</h2>}
        </div>
        {children && (
          <div className="flex gap-[23.5px]" aria-label="헤더 액션">
            {children}
          </div>
        )}
      </header>
      <div className={HEADER_HEIGHT} aria-hidden />
    </>
  );
};

export default DetailHeader;
