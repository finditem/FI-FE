"use client";

import { useGetUsersMe } from "@/api/fetch/user";
import { KebabMenu } from "@/components/common";
import { DetailHeader } from "@/components/layout";
import { HeaderMenu, HeaderShare } from "@/components/layout/DetailHeader/DetailHeaderParts";
import { useClickOutside } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NoticeDeleteModal from "./_internal/NoticeDeleteModal";
import { ContentShareModal } from "@/components/domain";
import { useGetNoticeDetail } from "@/api/fetch/notice";

const NoticeDetailHeader = ({ id }: { id: number }) => {
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
    title: title || "찾아줘 공지사항 공유",
    summary: content || "공지사항을 확인해보세요",
    thumbnailUrl,
    likeCount: likeCount || 0,
    commentCount: commentCount || 0,
    viewCount: viewCount || 0,
    link: window.location.href,
  };

  return (
    <div className="relative" ref={kebabMenuRef}>
      <DetailHeader>
        <HeaderShare onClick={() => setOpenShareModal(true)} ariaLabel="공지사항 공유" />
        {isAdmin && (
          <HeaderMenu
            ariaLabel="공지 관리 메뉴"
            onClick={() => setIsKebabMenuOpen((prev) => !prev)}
          />
        )}
      </DetailHeader>

      {isKebabMenuOpen && (
        <div className="absolute right-5 top-[54px] z-40">
          <KebabMenu
            items={[
              {
                text: "게시글 수정하기",
                icon: { name: "Edit" },
                onClick: () => {
                  router.push(`/admin/notice/write/${id}`);
                },
              },
              {
                text: "게시글 삭제하기",
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
