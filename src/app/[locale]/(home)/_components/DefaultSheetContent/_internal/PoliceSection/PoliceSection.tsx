"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import MainCardList from "../MainCardList/MainCardList";
import usePoliceItems from "../../../../_hooks/usePoliceItems/usePoliceItems";
import { usePublicRecentFound } from "@/api/fetch/publicData/api/usePublicRecentFound";
import { PublicDataItem } from "@/types";

const NO_IMAGE_URL = "https://minwon24.police.go.kr/images/sub/img02_no_img.gif";

const PoliceSection = () => {
  const t = useTranslations("PoliceSection");
  const policeItems = usePoliceItems();
  const { data, isLoading } = usePublicRecentFound(5);

  const rawItems = data?.items?.item;
  const itemsArray = [rawItems].flat().filter((item): item is PublicDataItem => !!item);

  const publicData = itemsArray.map((item) => ({
    postId: item.atcId,
    title: item.fdPrdtNm || item.fdSbjt || t("noTitle"),
    thumbnailImageUrl:
      item.fdFilePathImg && item.fdFilePathImg !== NO_IMAGE_URL ? item.fdFilePathImg : "",
    createdAt: item.fdYmd,
  }));

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl px-3 py-4 bg-fill-brand-subtle-default_2 tablet:gap-10">
        <div className="flex shrink-0 flex-col gap-[10px] px-3 py-[10px]">
          <span className="whitespace-pre text-body2-semibold text-brand-normal-default">
            {t("banner")}
          </span>
          <Image src="/main/police24-icon.svg" alt={t("logoAlt")} width={77} height={21} />
        </div>

        <div className="flex min-w-0 flex-1 items-stretch justify-end gap-2 tablet:gap-3">
          {policeItems.map(({ href, headLabel, label }) => (
            <Link
              key={href}
              href={href}
              className="group box-border h-[60px] w-[60px] shrink-0 rounded-[10px] border border-brand-normal-disabled/90 bg-white px-[14px] py-3 flex-col-center tablet:h-14 tablet:min-h-14 tablet:w-auto tablet:min-w-0 tablet:flex-1"
            >
              <div className="flex flex-col items-center text-center text-caption1-medium transition-colors">
                <span className="text-neutralInversed-normal-focused group-hover:text-caption1-semibold group-hover:text-flatGreen-500">
                  {headLabel}
                </span>
                <span className="text-nowrap text-neutralInversed-normal-default group-hover:text-caption1-semibold group-hover:text-flatGreen-500">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MainCardList mode="public" isLoading={isLoading} cardListData={publicData} />
    </section>
  );
};

export default PoliceSection;
