"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, KebabMenuButton, ProfileAvatar } from "@/components/common";
import { cn, formatDate } from "@/utils";
import { useClickOutside } from "@/hooks";
import { DeleteCommentVariables } from "@/api/fetch/comment";
import { QueryKey } from "@tanstack/react-query";
import { IconName } from "@/components/common/Icon/Icon";
import ReportModal from "@/components/domain/ReportModal/ReportModal";
import UserBlockModal from "@/components/domain/PostReportBlockActions/UserBlockModal/UserBlockModal";

/**
 * 댓글 작성자 정보 및 메뉴
 *
 * @author jikwon
 */

interface CommentMetaHeaderProps {
  data: {
    /** 작성자 ID */
    authorId: string;
    /** 작성 시간 */
    createdAt: string;
    /** 작성자 이름 */
    authorName: string;
    /** 작성자 프로필 이미지 URL */
    profileImage: string;
    /** 댓글 ID */
    commentId: number;
    /** 댓글 삭제 여부 */
    deleted: boolean;
    /** 댓글 삭제 가능 여부 */
    canDelete: boolean;
  };
  /** 비회원 여부 */
  isGuest: boolean;
  /** 답글 여부 */
  isThreadItem: boolean;
  /** 쿼리 키 */
  queryKey: QueryKey;
  /** 댓글 삭제 함수 */
  onDeleteComment: (commentVariables: DeleteCommentVariables) => void;
}

const authorStyle = "line-clamp-2 break-all text-body1-medium text-layout-header-default";

const CommentMetaHeader = ({
  data,
  isGuest,
  isThreadItem,
  queryKey,
  onDeleteComment,
}: CommentMetaHeaderProps) => {
  const { authorId, createdAt, authorName, profileImage, commentId, deleted, canDelete } = data;

  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const ref = useClickOutside(() => setIsKebabMenuOpen(false));

  const handleDeleteComment = () => {
    onDeleteComment?.({ commentId, queryKey });
    setIsKebabMenuOpen(false);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        {isGuest ? (
          <div className="flex gap-[14px]">
            <ProfileAvatar src={profileImage} size={isThreadItem ? 30 : 40} />

            <div className="flex flex-col flex-wrap items-start">
              <span className={authorStyle}>{authorName}</span>

              <time dateTime={createdAt} className="text-body2-regular text-layout-body-default">
                {formatDate(createdAt)}
              </time>
            </div>
          </div>
        ) : (
          <Link
            href={`/user/${authorId}`}
            aria-label={`${authorName} 프로필 보기`}
            className="flex gap-[14px]"
          >
            <ProfileAvatar src={profileImage} size={isThreadItem ? 30 : 40} />

            <div className="flex flex-col flex-wrap items-start">
              <span className={authorStyle}>{authorName}</span>

              <time dateTime={createdAt} className="text-body2-regular text-layout-body-default">
                {formatDate(createdAt)}
              </time>
            </div>
          </Link>
        )}

        <div ref={ref} className="relative">
          <KebabMenuButton
            size="small"
            ariaLabel={isKebabMenuOpen ? "댓글 메뉴 닫기" : "댓글 메뉴 열기"}
            disabled={isGuest}
            onClick={() => setIsKebabMenuOpen((prev) => !prev)}
          />

          {isKebabMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1">
              {canDelete ? (
                <button
                  className={cn(
                    "glass-card min-h-[57px] min-w-[182px] gap-2 text-nowrap rounded-[20px] border px-7 py-4 text-system-warning flex-center",
                    "border-white bg-fill-neutral-subtle-default",
                    deleted && "cursor-not-allowed"
                  )}
                  onClick={handleDeleteComment}
                  disabled={deleted}
                >
                  <Icon name="Trash" size={20} />
                  <span className="text-h3-medium">댓글 삭제하기</span>
                </button>
              ) : (
                <div className="glass-card rounded-[20px] border border-white bg-fill-neutral-subtle-default">
                  <MenuItem
                    icon="UserReport"
                    label="작성자 신고하기"
                    onClick={() => setReportOpen(true)}
                  />

                  <hr className="w-full border border-white" />

                  <MenuItem
                    icon="UserBlock"
                    label="작성자 차단하기"
                    onClick={() => setBlockOpen(true)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {reportOpen && (
        <ReportModal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="COMMENT"
          targetId={commentId}
        />
      )}

      {blockOpen && (
        <UserBlockModal
          isOpen={blockOpen}
          onClose={() => setBlockOpen(false)}
          writerId={Number(authorId)}
        />
      )}
    </>
  );
};

export default CommentMetaHeader;

const MenuItem = ({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className="min-h-[57px] min-w-[182px] gap-2 text-nowrap px-7 py-4 flex-center"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={icon} size={18} />
      <span className="text-h3-medium text-system-warning">{label}</span>
    </button>
  );
};
