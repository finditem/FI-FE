import type { Dispatch, SetStateAction } from "react";
import { Icon } from "@/components/common";
import { cn, formatCappedNumber } from "@/utils";

/**
 * 답글 작성 및 답글 보기 버튼
 *
 * @author jikwon
 */

interface CommentActionsProps {
  /** 답글 여부 */
  isThreadItem: boolean;
  /** 답글 보기 상태 */
  viewReply: boolean;
  /** 답글 보기 상태 변경 함수 */
  setViewReply: Dispatch<SetStateAction<boolean>>;
  /** 답글 폼 열기 상태 */
  isReplyFormOpen: boolean;
  /** 답글 폼 열기 상태 변경 함수 */
  setIsReplyFormOpen: Dispatch<SetStateAction<boolean>>;
  /** 비회원 여부 */
  isGuest: boolean;
  /** 비회원이 상호작용을 시도할 때 호출되는 함수 */
  onGuestAction?: () => void;
  /** 답글 수 */
  replyCount: number;
}

const CommentActions = ({
  isThreadItem,
  viewReply,
  setViewReply,
  isReplyFormOpen,
  setIsReplyFormOpen,
  isGuest,
  onGuestAction,
  replyCount,
}: CommentActionsProps) => {
  const handleReplyFormToggle = () => {
    if (isGuest) {
      onGuestAction?.();
      return;
    }

    setIsReplyFormOpen((prev) => !prev);
  };

  return (
    !isThreadItem && (
      <div className="flex items-center gap-3 py-2">
        <button
          className={cn("flex items-center gap-1", replyCount === 0 && "cursor-not-allowed")}
          onClick={() => setViewReply((prev) => !prev)}
          disabled={replyCount === 0}
        >
          <span
            className={cn(
              "text-body1-medium",
              viewReply ? "text-brand-normal-enteredSelected" : "text-layout-header-default"
            )}
          >
            답글 <span>{formatCappedNumber(replyCount, 999)}</span>개
          </span>
          <Icon
            name="ArrowDownSmall"
            size={24}
            className={cn(
              "transition-all",
              viewReply
                ? "rotate-180 text-brand-strongUseThis-default"
                : "text-layout-header-default"
            )}
          />
        </button>

        <button
          className={cn(
            "text-body1-medium",
            isReplyFormOpen ? "text-brand-normal-enteredSelected" : "text-neutral-strong-default"
          )}
          onClick={handleReplyFormToggle}
        >
          답글 작성
        </button>
      </div>
    )
  );
};

export default CommentActions;
