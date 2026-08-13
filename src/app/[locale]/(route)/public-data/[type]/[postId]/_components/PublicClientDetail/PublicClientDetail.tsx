"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("PublicClientDetail");
  const { addToast } = useToast();
  const { isLoading, isError, detailData } = usePublicClientDetail(id);

  useEffect(() => {
    if (isError) {
      addToast(t("loadFailedToast"), "error");
    }
  }, [isError, addToast, t]);

  if (isLoading) return <PublicDetailSkeleton />;
  if (isError || !detailData) return <PublicDetailSkeleton isError />;

  const { isLost, headerData, itemData, title, content, place, office, tel, imageSrc } = detailData;

  const metaData = {
    title: title || t("defaultShareTitle"),
    summary: content || t("defaultShareSummary"),
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
