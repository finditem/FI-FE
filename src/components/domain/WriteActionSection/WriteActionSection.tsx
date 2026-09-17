import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/common";
import { cn } from "@/utils";

/**
 * 게시글 작성 폼 하단에 고정되는 제출(작성 완료) 영역입니다.
 *
 * @remarks
 * - 상위 `<form>` 안에서 쓰는 것을 전제로 `type="submit"` 버튼을 둡니다.
 *
 * @author hyungjun
 */

interface ActionSectionProps {
  /** `true`이면 작성 완료 버튼을 누를 수 없습니다 */
  disabled: boolean;
  /** 버튼 텍스트를 기본값("작성 완료") 대신 표시합니다. 예: 수정 제한 카운트다운 */
  label?: ReactNode;
  /** 수정 횟수 제한으로 잠긴 상태인지. true면 버튼을 회색 disabled 톤으로 표시합니다. */
  isRateLimited?: boolean;
}

/**
 * @example
 * ```tsx
 * <WriteActionSection disabled={!isValid} />
 * ```
 */

const WriteActionSection = ({ disabled, label, isRateLimited }: ActionSectionProps) => {
  const t = useTranslations("WriteActionSection");

  return (
    <section className="px-5 pb-8 pt-3">
      <Button
        type="submit"
        className={cn(
          "w-full",
          isRateLimited &&
            "disabled:!text-neutralInversed-strong-disabled disabled:!bg-fill-neutralInversed-normal-disabled"
        )}
        disabled={disabled}
      >
        {label ?? t("submit")}
      </Button>
    </section>
  );
};

export default WriteActionSection;
