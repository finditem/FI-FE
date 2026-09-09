"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRecentFound } from "@/api/fetch/mapController";
import MainCardList from "../MainCardList/MainCardList";
import { useMainKakaoMapStore } from "@/store";
import RecentFoundItemEmpty from "../RecentFoundItemEmpty/RecentFoundItemEmpty";
import { RecentFoundItem } from "@/api/fetch/mapController";

const RecentFoundItemSection = () => {
  const t = useTranslations("RecentFoundItemSection");
  const { data: recentFoundItems, isLoading } = useRecentFound();
  const address = useMainKakaoMapStore((s) => s.address);
  const latLng = useMainKakaoMapStore((s) => s.latLng);
  const syncAddressFromLatLng = useMainKakaoMapStore((s) => s.syncAddressFromLatLng);

  const result = recentFoundItems?.result;

  useEffect(() => {
    if (isLoading) return;
    syncAddressFromLatLng();
  }, [isLoading, latLng, syncAddressFromLatLng]);

  const isEmpty = !isLoading && Array.isArray(result) && result.length === 0;

  const data = recentFoundItems?.result?.map(
    ({ postId, title, thumbnailImageUrl, createdAt }: RecentFoundItem) => ({
      postId: String(postId),
      title,
      thumbnailImageUrl,
      createdAt,
    })
  );

  return (
    <section className="space-y-2">
      <p className="mb-5 mt-14 pl-1 text-h2-bold text-neutral-strong-hover">
        {t.rich("ownerWanted", {
          em: (chunks) => <span className="text-brand-normal-default">{chunks}</span>,
        })}
      </p>
      {isEmpty ? (
        <RecentFoundItemEmpty />
      ) : (
        <>
          <h2 className="space-x-1 py-2 pl-1 text-h3-semibold">
            <span className="text-brand-normal-default">{address}</span>
            <span className="text-neutral-strong-hover">{t("sectionTitle")}</span>
          </h2>
          <MainCardList isLoading={isLoading} cardListData={data} />
        </>
      )}
    </section>
  );
};

export default RecentFoundItemSection;
