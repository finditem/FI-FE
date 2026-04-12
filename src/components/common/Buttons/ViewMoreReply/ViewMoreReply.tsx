"use client";

import Icon from "../../Icon/Icon";
import { ReactNode, useState } from "react";

/**
 * @author hyungjun
 *
 * 댓글 아래에서 "답글 더보기"와 "답글 쓰기" 버튼으로 사용되는 컴포넌트입니다.
 * 두 개의 독립적인 버튼으로 구성되어 있습니다.
 * - 첫 번째 버튼: 답글 더보기 (추가 답글을 불러오는 액션)
 * - 두 번째 버튼: 답글 쓰기 (답글 작성 액션)
 *
 * @param text - 더보기 버튼에 표시할 텍스트입니다. 예: "답글 5개"
 * @param onWriteReply - 답글 쓰기 버튼 클릭 핸들러입니다. (선택적)
 * @param viewMoreAriaLabel - 더보기 버튼의 접근성 라벨입니다. (기본값: "답글 더보기")
 * @param writeReplyAriaLabel - 답글 쓰기 버튼의 접근성 라벨입니다. (기본값: "답글 쓰기")
 * @param disabled - 버튼 비활성화 여부입니다. (기본값: false)
 * @param replyComponent - 답글 컴포넌트입니다. (선택적)
 *
 * @example
 * ```tsx
 * <ViewMoreReply
 *   text="답글 5개"
 *   onWriteReply={handleWriteReply}
 *   viewMoreAriaLabel="답글 더보기"
 *   writeReplyAriaLabel="답글 쓰기"
 *   disabled={false}
 *   replyComponent={<div>답글 컴포넌트</div>}
 * />
 * ```
 */

interface ViewMoreReplyProps {
  text: string;
  onWriteReply?: () => void;
  viewMoreAriaLabel?: string;
  writeReplyAriaLabel?: string;
  disabled?: boolean;
  replyComponent?: ReactNode;
}

const ViewMoreReply = ({
  text,
  onWriteReply,
  viewMoreAriaLabel = "답글 더보기",
  writeReplyAriaLabel = "답글 쓰기",
  disabled = false,
  replyComponent,
}: ViewMoreReplyProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-10 w-full items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1"
          aria-label={viewMoreAriaLabel}
          disabled={disabled}
        >
          <span className="text-body1-medium text-brand-normal-default transition-colors duration-150 hover:text-brand-normal-hover active:text-brand-normal-pressed disabled:text-brand-normal-disabled">
            {text}
          </span>
          <Icon name={isOpen ? "ArrowUp" : "ArrowDown"} size={20} />
        </button>
        <button
          onClick={onWriteReply}
          className="text-body1-medium text-neutral-strong-default transition-colors duration-150 hover:text-black disabled:text-neutral-strong-disabled"
          aria-label={writeReplyAriaLabel}
          disabled={disabled}
        >
          답글 쓰기
        </button>
      </div>
      {isOpen && replyComponent}
    </div>
  );
};

export default ViewMoreReply;
