"use client";

import { useGetUsersMe } from "@/api/fetch/user";
import { KebabMenu, DetailHeader, HeaderMenu, HeaderShare, ContentShareModal } from "@/components";
import { useClickOutside } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NoticeDeleteModal from "./_internal/NoticeDeleteModal";
import { useGetNoticeDetail } from "@/api/fetch/notice";
import { useTranslations } from "next-intl";

const NoticeDetailHeader = ({ id }: { id: number }) => {
  const t = useTranslations("NoticePage.detail");
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const kebabMenuRef = useClickOutside(() => setIsKebabMenuOpen(false));
  const { data: userData } = useGetUsersMe();
  const { data: noticeData } = useGetNoticeDetail({ id });
  const router = useRouter();
  const isAdmin = userData?.result?.role === "ADMIN";
  const { title, content, thumbnailUrl, likeCount, commentCount, viewCount } =
    noticeData?.result || {};

  const metaData = {
    title: title || t("shareTitle"),
    summary: content || t("shareSummary"),
    thumbnailUrl,
    likeCount: likeCount || 0,
    commentCount: commentCount || 0,
    viewCount: viewCount || 0,
    link: typeof window !== "undefined" ? window.location.href : "",
  };

  return (
    <div className="relative" ref={kebabMenuRef}>
      <DetailHeader>
        <HeaderShare onClick={() => setOpenShareModal(true)} ariaLabel={t("shareAriaLabel")} />
        {isAdmin && (
          <HeaderMenu
            ariaLabel={t("adminMenuAriaLabel")}
            onClick={() => setIsKebabMenuOpen((prev) => !prev)}
          />
        )}
      </DetailHeader>

      {isKebabMenuOpen && (
        <div className="absolute right-5 top-[54px] z-40">
          <KebabMenu
            items={[
              {
                text: t("edit"),
                icon: { name: "Edit" },
                onClick: () => {
                  router.push(`/admin/notice/write/${id}`);
                },
              },
              {
                text: t("delete"),
                icon: { name: "Trash" },
                textColor: "text-system-warning",
                onClick: () => setIsDeleteModalOpen(true),
              },
            ]}
          />
        </div>
      )}
      <NoticeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        postId={id}
      />
      <ContentShareModal
        isOpen={openShareModal}
        onClose={() => setOpenShareModal(false)}
        metaData={metaData}
        objectType="feed"
      />
    </div>
  );
};

export default NoticeDetailHeader;
