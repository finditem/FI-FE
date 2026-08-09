"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";

/**
 * 게시글 신고 및 작성자 차단 버튼을 렌더링하는 컴포넌트입니다.
 *
 * @author jikwon
 */

interface PostReportBlockActionsProps {
  /** 신고 모달을 여는 함수 */
  onOpenReport: () => void;
  /** 차단 모달을 여는 함수 */
  onOpenBlock: () => void;
}

/**
 * @example
 * ```tsx
 * <PostReportBlockActions
 *   onOpenReport={() => setIsReportOpen(true)}
 *   onOpenBlock={() => setIsBlockOpen(true)}
 * />
 * ```
 */

const PostReportBlockActions = ({ onOpenReport, onOpenBlock }: PostReportBlockActionsProps) => {
  const t = useTranslations("PostReportBlockActions");

  return (
    <>
      <ActionButton
        icon={<Icon name="UserReport" size={18} />}
        label={t("reportPost")}
        onClick={onOpenReport}
        testId="post-report-button"
      />

      <hr className="w-full border border-white" />

      <ActionButton
        icon={<Icon name="UserBlock" size={20} />}
        label={t("blockAuthor")}
        onClick={onOpenBlock}
        testId="post-block-button"
      />
    </>
  );
};

export default PostReportBlockActions;

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  testId?: string;
}

const ActionButton = ({ icon, label, onClick, testId }: ActionButtonProps) => {
  return (
    <button
      type="button"
      className="gap-2 px-7 py-4 flex-center"
      onClick={onClick}
      data-testid={testId}
    >
      {icon}
      <span className="text-system-warning">{label}</span>
    </button>
  );
};
