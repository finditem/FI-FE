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
import type { PublicDataItem } from "@/types";

interface PublicClientDetailProps {
  id: string;
  /**
   * 서버에서 조회한 항목입니다. 있으면 본문을 바로 그려 초기 HTML에 싣습니다.
   * 서버 조회가 실패하면 비어 있고, 이때는 기존처럼 클라이언트 조회가 끝날 때까지 스켈레톤을 보여줍니다.
   */
  initialItem?: PublicDataItem;
}

const PublicClientDetail = ({ id, initialItem }: PublicClientDetailProps) => {
  const t = useTranslations("PublicClientDetail");
  const { addToast } = useToast();
  const { isLoading, isError, detailData } = usePublicClientDetail(id, initialItem);

  useEffect(() => {
    if (isError) {
      addToast(t("loadFailedToast"), "error");
    }
  }, [isError, addToast, t]);

  // 서버 데이터가 있으면 클라이언트 조회가 실패해도 본문은 유지하고 토스트로만 알린다.
  if (!detailData) return <PublicDetailSkeleton isError={!isLoading && isError} />;

  const { isLost, headerData, itemData, title, content, place, office, tel, imageSrc } = detailData;

  const metaData = {
    title: title || t("defaultShareTitle"),
    summary: content || t("defaultShareSummary"),
    thumbnailUrl: imageSrc,
    likeCount: 0,
    commentCount: 0,
    viewCount: 0,
    // 서버 렌더에서는 window가 없으므로 빈 값으로 두고, 공유 모달은 hydration 이후에만 열린다.
    link: typeof window !== "undefined" ? window.location.href : "",
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
