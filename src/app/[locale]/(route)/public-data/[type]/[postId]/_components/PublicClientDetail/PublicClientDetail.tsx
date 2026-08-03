"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import {
  PublicDataDetailHeader,
  PublicDetailHeader,
  PublicDetailInfo,
  PublicDetailSkeleton,
  PublicLostItemInfo,
  PublicStorageInfo,
} from "../_internal";
import { usePublicClientDetail } from "../../_hooks/usePublicClientDetail/usePublicClientDetail";

const PublicClientDetail = ({ id }: { id: string }) => {
  const { addToast } = useToast();
  const { isLoading, isError, detailData } = usePublicClientDetail(id);

  useEffect(() => {
    if (isError) {
      addToast("게시글 불러오기에 실패했어요", "error");
    }
  }, [isError, addToast]);

  if (isLoading) return <PublicDetailSkeleton />;
  if (isError || !detailData) return <PublicDetailSkeleton isError />;

  const { isLost, headerData, itemData, title, content, place, office, tel, imageSrc } = detailData;

  const metaData = {
    title: title || "찾아줘 경찰청 데이터 공유",
    summary: content || "경찰청 데이터를 확인해보세요",
    thumbnailUrl: imageSrc,
    likeCount: 0,
    commentCount: 0,
    viewCount: 0,
    link: window.location.href,
  };

  return (
    <>
      <PublicDataDetailHeader metaData={metaData} />

      <article className="h-base">
        <PublicDetailHeader headerData={headerData} />

        <div className="space-y-8 px-5 py-[30px]">
          <PublicDetailInfo category={itemData.prdtClNm} title={title} content={content} />
          <PublicLostItemInfo date={itemData.fdYmd} isLost={isLost} />
          <PublicStorageInfo
            office={office}
            department={office}
            tel={tel}
            place={place}
            isLost={isLost}
          />
        </div>
      </article>
    </>
  );
};

export default PublicClientDetail;
