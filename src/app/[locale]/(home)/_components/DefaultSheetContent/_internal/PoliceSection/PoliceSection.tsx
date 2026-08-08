"use client";

import Image from "next/image";
import Link from "next/link";
import MainCardList from "../MainCardList/MainCardList";
import { POLICE_ITEMS } from "../../../HOME_CONST";
import { usePublicRecentFound } from "@/api/fetch/publicData/api/usePublicRecentFound";
import { PublicDataItem } from "@/types";

const NO_IMAGE_URL = "https://minwon24.police.go.kr/images/sub/img02_no_img.gif";

const PoliceSection = () => {
  const { data, isLoading } = usePublicRecentFound(5);

  const rawItems = data?.items?.item;
  const itemsArray = [rawItems].flat().filter((item): item is PublicDataItem => !!item);

  const publicData = itemsArray.map((item) => ({
    postId: item.atcId,
    title: item.fdPrdtNm || item.fdSbjt || "제목 없음",
    thumbnailImageUrl:
      item.fdFilePathImg && item.fdFilePathImg !== NO_IMAGE_URL ? item.fdFilePathImg : "",
    createdAt: item.fdYmd,
  }));

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl px-3 py-4 bg-fill-brand-subtle-default_2 tablet:gap-10">
        <div className="flex shrink-0 flex-col gap-[10px] px-3 py-[10px]">
          <span className="whitespace-pre text-body2-semibold text-brand-normal-default">{`경찰청 분실물도\n찾아줘!에서 확인해요`}</span>
          <Image src="/main/police24-icon.svg" alt="경찰민원24로고" width={77} height={21} />
        </div>

        <div className="flex min-w-0 flex-1 items-stretch justify-end gap-2 tablet:gap-3">
          {POLICE_ITEMS.map(({ href, headLabel, label }) => (
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
