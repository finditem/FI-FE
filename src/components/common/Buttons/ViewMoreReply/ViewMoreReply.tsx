"use client";

import Icon from "../../Icon/Icon";
import { ReactNode, useState } from "react";

/**
 * 댓글 하단에서 답글 목록 펼침과 답글 작성 진입을 한 줄에 두는 컨트롤입니다.
 *
 * @remarks
 * - `"use client"`이며 첫 버튼은 내부 `isOpen`만 토글합니다. API 호출은 부모에서 `replyComponent`·상위 상태로 연결하세요.
 * - 펼쳤을 때만 `replyComponent`를 렌더합니다.
 * - 첫 버튼 라벨은 `text`, 화살표는 열림 여부에 따라 위·아래로 바뀝니다.
 * - 둘째 버튼 문구는 항상 `답글 쓰기`이며, 클릭 시 `onWriteReply`를 호출합니다.
 * - `disabled`는 두 버튼에 공통으로 적용됩니다.
 *
 * @author hyungjun
 */

interface ViewMoreReplyProps {
  /** 첫 버튼에 보일 문구(예: 남은 답글 수 안내) */
  text: string;
  /** 답글 쓰기 버튼 클릭 시 실행할 핸들러 */
  onWriteReply?: () => void;
  /** 첫 버튼 `aria-label` (default: '답글 더보기') */
  viewMoreAriaLabel?: string;
  /** 답글 쓰기 버튼 `aria-label` (default: '답글 쓰기') */
  writeReplyAriaLabel?: string;
  /** 두 버튼 공통 비활성 (default: false) */
  disabled?: boolean;
  /** 펼침 상태일 때만 아래에 렌더할 답글 영역 */
  replyComponent?: ReactNode;
}

/**
 * @example
 * ```tsx
 * <ViewMoreReply
 *   text="답글 5개"
 *   onWriteReply={handleWriteReply}
 *   replyComponent={<ReplyList replies={replies} />}
 * />
 * ```
 */

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
