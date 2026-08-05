"use client";

import { useState } from "react";
import { ContentShareModal, DetailHeader, HeaderShare } from "@/components";

interface PublicDataDetailHeaderProps {
  metaData: {
    title: string;
    summary: string;
    thumbnailUrl: string;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    link: string;
  };
}

const PublicDataDetailHeader = ({ metaData }: PublicDataDetailHeaderProps) => {
  const [openShareModal, setOpenShareModal] = useState(false);

  if (!metaData) return null;

  return (
    <>
      <DetailHeader>
        <HeaderShare onClick={() => setOpenShareModal(true)} />
      </DetailHeader>

      <ContentShareModal
        isOpen={openShareModal}
        onClose={() => setOpenShareModal(false)}
        metaData={metaData}
        objectType="feed"
      />
    </>
  );
};

export default PublicDataDetailHeader;
