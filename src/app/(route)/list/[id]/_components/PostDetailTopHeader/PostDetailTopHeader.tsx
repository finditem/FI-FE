"use client";

import { useState } from "react";
import { DetailHeader } from "@/components/layout";
import PostActionMenu from "../PostActionMenu/PostActionMenu";
import {
  HeaderMenu,
  HeaderShare,
  HeaderStar,
} from "@/components/layout/DetailHeader/DetailHeaderParts";
import { PostActionData } from "../../_types/PostActionType";
import { useToggleFavorite } from "../../_hooks/useToggleFavorite";
import { useClickOutside } from "@/hooks";
import { ContentShareModal } from "@/components/domain";
import { useGetMetaData } from "@/api/fetch/post";

interface PostDetailTopHeaderProps {
  postId: number;
  postData: PostActionData;
}

const PostDetailTopHeader = ({ postId, postData }: PostDetailTopHeaderProps) => {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openOptionModal, setOpenOptionModal] = useState(false);

  const { handleToggleFavorite, isPending } = useToggleFavorite({ postId });
  const ref = useClickOutside(() => setOpenOptionModal(false));

  const { data: postMetaData } = useGetMetaData({ postId });
  const { title, summary, thumbnailUrl, address, likeCount, commentCount, viewCount } =
    postMetaData?.result || {};

  const metaData = {
    title: title || "찾아줘 게시글 공유",
    summary: summary || "게시글을 확인해보세요",
    address: address || "위치 정보 없음",
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
            ariaLabel="게시글 즐겨찾기"
            data-testid="post-detail-favorite-button"
          />
          <HeaderShare
            onClick={() => setOpenShareModal(true)}
            ariaLabel="게시글 공유"
            data-testid="post-detail-share-button"
          />
          <div ref={ref} className="relative flex items-center">
            <HeaderMenu
              onClick={() => setOpenOptionModal((v) => !v)}
              ariaLabel="게시글 메뉴"
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
