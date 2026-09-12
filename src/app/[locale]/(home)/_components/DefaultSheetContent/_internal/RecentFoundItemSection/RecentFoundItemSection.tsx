"use client";

import { useTranslations } from "next-intl";
import { useRecentFound } from "@/api/fetch/mapController";
import MainCardList from "../MainCardList/MainCardList";
import RecentFoundItemEmpty from "../RecentFoundItemEmpty/RecentFoundItemEmpty";
import { RecentFoundItem } from "@/api/fetch/mapController";

const RecentFoundItemSection = () => {
  const t = useTranslations("RecentFoundItemSection");
  const { data: recentFoundItems, isLoading } = useRecentFound();

  const result = recentFoundItems?.result;
  const isEmpty = !isLoading && (!Array.isArray(result) || result.length === 0);

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
        <MainCardList isLoading={isLoading} cardListData={data} />
      )}
    </section>
  );
};

export default RecentFoundItemSection;
