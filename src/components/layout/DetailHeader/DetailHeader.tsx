"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common";
import { cn } from "@/utils";

interface DetailHeaderProps {
  title?: ReactNode;
  children?: ReactNode;
  onBack?: () => void;
}

/**
 * @author hyungjun
 *
 * @description
 * 상세 페이지에서 사용하는 헤더 컴포넌트입니다.
 * 뒤로가기 버튼과 제목을 표시하며, 오른쪽에 추가 액션 버튼들을 배치할 수 있습니다.
 * sticky 포지션으로 스크롤 시에도 상단에 고정됩니다.
 *
 * @param title - 헤더에 표시할 제목입니다. (선택)
 * @param children - 헤더 오른쪽에 배치할 액션 버튼들입니다. (선택)
 * `DetailHeaderParts`에서 제공하는 `DetailHeaderSave`, `DetailHeaderSearch`, `DetailHeaderStar`, `DetailHeaderMenu` 등의 컴포넌트를 사용할 수 있습니다.
 *
 * @example
 * ```tsx
 * import { DetailHeader } from "@/components/layout";
 * import { DetailHeaderSave } from "@/components/layout/DetailHeader/DetailHeaderParts";
 *
 * // 제목만 있는 경우
 * <DetailHeader title="자주 묻는 질문" />
 *
 * // 제목과 저장 버튼이 있는 경우
 * <DetailHeader title="글쓰기">
 *   <DetailHeaderSave onClick={handleSave} />
 * </DetailHeader>
 *
 * // 여러 액션 버튼을 함께 사용하는 경우
 * <DetailHeader title="게시글 상세">
 *   <DetailHeaderStar isActive />
 *   <DetailHeaderMenu onClick={handleMenu} />
 * </DetailHeader>
 * ```
 */

const HEADER_HEIGHT = "h-14";

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
