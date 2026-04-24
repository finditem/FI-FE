import { ButtonHTMLAttributes } from "react";
import Icon from "../../Icon/Icon";
import { cn } from "@/utils";

/**
 * 댓글·답글 목록에서 남은 개수를 펼치기 위한 더보기 트리거입니다.
 *
 * @remarks
 * - `ButtonHTMLAttributes`를 확장하므로 `onClick`, `disabled`, `className` 등은 안쪽 `button`으로 전달됩니다.
 * - `count`가 0 이하면 `null`을 반환합니다.
 * - `isThreadItem`이면 카드형 전폭 레이아웃과 `답글 … 더 보기` 문구, 아니면 목록용 여백·`댓글 … 더 보기`·더 큰 타이포를 씁니다.
 * - `aria-label`은 구현에서 `댓글 더 보기`로 고정입니다.
 *
 * @author hyungjun
 */
interface ViewMoreCommentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 더 불러올 수 있는 항목 수(0 이하면 렌더하지 않음) */
  count: number;
  /** 답글 스레드 행 등 좁은 맥락용 스타일·문구 (default: false) */
  isThreadItem?: boolean;
}

/**
 * @example
 * ```tsx
 * <ViewMoreComment count={remaining} onClick={fetchMore} />
 *
 * <ViewMoreComment count={replyCount} isThreadItem onClick={fetchReplies} />
 * ```
 */

const ViewMoreComment = ({ count, isThreadItem = false, ...props }: ViewMoreCommentProps) => {
  if (count <= 0) return null;

  return (
    <div className={cn(!isThreadItem && "px-5 py-2 flex-center")}>
      <button
        type="button"
        aria-label="댓글 더 보기"
        className={cn(
          "flex items-center gap-1 px-5 py-2 text-brand-normal-default",
          isThreadItem &&
            "w-full rounded-[12px] border border-divider-default bg-white flex-center",
          isThreadItem ? "text-body1-regular" : "text-h3-medium"
        )}
        {...props}
      >
        <span>{isThreadItem ? "답글" : "댓글"}</span>
        <span>{count}개</span>
        <span>더 보기</span>
        <Icon name="ArrowDownSmall" size={24} className="text-brand-normal-default" />
      </button>
    </div>
  );
};

export default ViewMoreComment;
