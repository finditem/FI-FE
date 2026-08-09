"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import { cn, formatCappedNumber } from "@/utils";

/**
 * 댓글 좋아요 및 답글 작성
 *
 * @author jikwon
 */

interface CommentFooterProps {
  footerData: {
    /** 댓글 ID */
    id: number;
    /** 좋아요 수 */
    likeCount: number;
    /** 좋아요 여부 */
    isLike: boolean;
    /** 댓글 삭제 여부 */
    deleted: boolean;
  };
  /** 1번 댓글 여부 */
  isReply: boolean;
  /** 비회원 여부 */
  isGuest: boolean;
  /** 비회원이 상호작용을 시도할 때 호출되는 함수 */
  onGuestAction?: () => void;
  /** 답글 폼 열림 상태 */
  isReplyFormOpen: boolean;
  /** 답글 폼 열림 상태 변경 함수 */
  setIsReplyFormOpen: (value: boolean) => void;
  /** 쿼리 키 */
  queryKey: unknown[];
  /** 댓글 좋아요 함수 */
  onFavoriteComment: (commentId: number, isLike: boolean, queryKey: unknown[]) => void;
}

const CommentFooter = ({
  footerData,
  isReply,
  isGuest,
  onGuestAction,
  isReplyFormOpen,
  setIsReplyFormOpen,
  queryKey,
  onFavoriteComment,
}: CommentFooterProps) => {
  const t = useTranslations("CommentFooter");
  const { likeCount, id, isLike, deleted } = footerData;

  const handleLikeClick = () => {
    if (isGuest) {
      onGuestAction?.();
      return;
    }

    onFavoriteComment(id, isLike, queryKey);
  };

  const handleReplyFormToggle = () => {
    if (isGuest) {
      onGuestAction?.();
      return;
    }

    setIsReplyFormOpen(!isReplyFormOpen);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        aria-label={isLike ? t("unlikeAriaLabel") : t("likeAriaLabel")}
        className={cn(
          "flex items-center gap-1 text-body2-regular text-neutral-strong-placeholder",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
        onClick={deleted ? undefined : handleLikeClick}
        disabled={deleted}
      >
        <Icon
          name="Heart"
          size={16}
          className={cn(isLike ? "text-system-favorite" : "text-border-divider-default")}
        />
        <span>{t("likeCount", { count: formatCappedNumber(likeCount, 999) })}</span>
      </button>

      {isReply && (
        <button
          className={cn(
            "text-body1-regular",
            isReplyFormOpen ? "text-brand-normal-enteredSelected" : "text-neutral-strong-default"
          )}
          onClick={handleReplyFormToggle}
        >
          {t("writeReply")}
        </button>
      )}
    </div>
  );
};

export default CommentFooter;
