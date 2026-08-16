"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DetailHeader, HeaderMenu, HeaderShare, HeaderStar, ContentShareModal } from "@/components";
import PostActionMenu from "../PostActionMenu/PostActionMenu";
import { PostActionData } from "../../_types/PostActionType";
import { useToggleFavorite } from "../../_hooks/useToggleFavorite/useToggleFavorite";
import { useClickOutside } from "@/hooks";
import { useGetMetaData } from "@/api/fetch/post";

interface PostDetailTopHeaderProps {
  postId: number;
  postData: PostActionData;
}

const PostDetailTopHeader = ({ postId, postData }: PostDetailTopHeaderProps) => {
  const t = useTranslations("PostDetailTopHeader");
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openOptionModal, setOpenOptionModal] = useState(false);

  const { handleToggleFavorite, isPending } = useToggleFavorite({ postId });
  const ref = useClickOutside(() => setOpenOptionModal(false));

  const { data: postMetaData } = useGetMetaData({ postId });
  const { title, summary, thumbnailUrl, address, likeCount, commentCount, viewCount } =
    postMetaData?.result || {};

  const metaData = {
    title: title || t("defaultShareTitle"),
    summary: summary || t("defaultShareSummary"),
    address: address || t("defaultAddress"),
    thumbnailUrl,
    likeCount: likeCount || 0,
    commentCount: commentCount || 0,
    viewCount: viewCount || 0,
    link: window.location.href,
  };

  return (
    <>
      <div className="sticky right-0 top-0 z-10 mx-auto">
        <DetailHeader>
          <HeaderStar
            disabled={isPending}
            isActive={postData.favoriteStatus}
            onClick={() => handleToggleFavorite(postData.favoriteStatus)}
            ariaLabel={t("favoriteAriaLabel")}
            data-testid="post-detail-favorite-button"
          />
          <HeaderShare
            onClick={() => setOpenShareModal(true)}
            ariaLabel={t("shareAriaLabel")}
            data-testid="post-detail-share-button"
          />
          <div ref={ref} className="relative flex items-center">
            <HeaderMenu
              onClick={() => setOpenOptionModal((v) => !v)}
              ariaLabel={t("menuAriaLabel")}
              data-testid="post-detail-menu-button"
            />
            <PostActionMenu
              open={openOptionModal}
              onClose={() => setOpenOptionModal(false)}
              postId={postId}
              postData={postData}
            />
          </div>
        </DetailHeader>
      </div>

      <ContentShareModal
        isOpen={openShareModal}
        onClose={() => setOpenShareModal(false)}
        metaData={metaData}
        objectType="location"
      />
    </>
  );
};

export default PostDetailTopHeader;
