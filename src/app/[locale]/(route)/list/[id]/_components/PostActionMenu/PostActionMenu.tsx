"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import {
  Button,
  Icon,
  ModalLayout,
  PostReportBlockActions,
  ReportModal,
  BlockUserModal as UserBlockModal,
} from "@/components";
import { useDeleteDetailPost, usePutPostStatus } from "@/api/fetch/post";
import { useGetUsersMe } from "@/api/fetch/user";
import { PostActionData } from "../../_types/PostActionType";
import { ACTION_MENU } from "../LIST_DETAIL_CONST";

interface PostOptionBoxProps {
  open: boolean;
  onClose: () => void;
  postId: number;
  postData: PostActionData;
}

const PostActionMenu = ({ open, onClose, postId, postData }: PostOptionBoxProps) => {
  const t = useTranslations("PostActionMenu");
  const router = useRouter();
  const { isMine, writerId, postStatus } = postData;
  const { data: me } = useGetUsersMe();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);

  const isFound = postStatus === "FOUND";
  const { mutate: putPostStatus } = usePutPostStatus(postId, isFound);

  const handleEditPost = () => {
    onClose();
    router.push(`/write/post/${postId}`);
  };

  const handleStatusChange = () => {
    putPostStatus({ postStatus: isFound ? "SEARCHING" : "FOUND" });
    onClose();
  };

  const handleOpenReport = () => {
    if (!me) return;

    setIsReportOpen(true);
  };

  const handleOpenBlock = () => {
    if (!me) return;

    setIsBlockOpen(true);
  };

  return (
    <>
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-10 mt-2",
            "min-h-[114px] w-[218px] overflow-hidden rounded-[20px] flex-col-center",
            "border border-white bg-fill-neutral-subtle-default",
            "text-nowrap text-h3-medium text-neutral-normal-default shadow-sm"
          )}
          data-testid="post-action-menu-container"
        >
          {isMine ? (
            <>
              <button
                className={ACTION_MENU.buttonStyle}
                onClick={handleEditPost}
                data-testid="post-menu-edit-button"
              >
                <Icon name="Edit" size={20} />
                <span>{t("editPost")}</span>
              </button>
              <hr className={ACTION_MENU.hrStyle} aria-hidden="true" />
              <button
                className={cn(ACTION_MENU.buttonStyle, "text-system-warning")}
                onClick={() => setDeleteModalOpen(true)}
                data-testid="post-menu-delete-button"
              >
                <Icon name="Trash" size={20} />
                <span>{t("deletePost")}</span>
              </button>
              <hr className={ACTION_MENU.hrStyle} aria-hidden="true" />
              <button
                className={ACTION_MENU.buttonStyle}
                onClick={handleStatusChange}
                data-testid="post-menu-status-button"
              >
                <Icon name="ArrowSwitchHorizontal" size={20} />
                <span>{isFound ? t("changeToSearching") : t("changeToFound")}</span>
              </button>
            </>
          ) : (
            <PostReportBlockActions onOpenReport={handleOpenReport} onOpenBlock={handleOpenBlock} />
          )}
        </div>
      )}

      <PostDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        postId={postId}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="POST"
        targetId={postId}
      />

      <UserBlockModal
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        writerId={writerId}
      />
    </>
  );
};

export default PostActionMenu;

interface PostDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

const PostDeleteModal = ({ isOpen, onClose, postId }: PostDeleteModalProps) => {
  const t = useTranslations("PostActionMenu");
  const { mutate: deletePost } = useDeleteDetailPost(postId);

  const handleDeletePost = (postId: number) => {
    deletePost({ postId });
    onClose();
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[350px] gap-6 rounded-[8px] p-6 flex-col-center"
    >
      <div className="space-y-1 text-center">
        <h2
          className="text-h3-semibold text-layout-header-default"
          data-testid="post-delete-modal-title"
        >
          {t("deleteConfirmTitle")}
        </h2>
        <p className="text-body5-regular text-layout-body-default">
          {t("deleteConfirmDescription")}
        </p>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" onClick={onClose} className={ACTION_MENU.deleteButtonStyle}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() => handleDeletePost(postId)}
          className={ACTION_MENU.deleteButtonStyle}
          data-testid="post-delete-confirm-button"
        >
          {t("deleteButton")}
        </Button>
      </div>
    </ModalLayout>
  );
};
