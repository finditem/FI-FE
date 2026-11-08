"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, ProfileAvatar } from "@/components";
import { cn } from "@/utils";
import { ImageResponse, userInformation } from "@/api/fetch/post";
import ImageSection from "@/app/[locale]/(route)/list/[id]/_components/_internal/ImageSection/ImageSection";
import PublicCallBottomSheet from "../PublicCallBottomSheet/PublicCallBottomSheet";
import Image from "next/image";

type HeaderData = {
  id: string;
  imageResponseList: ImageResponse[];
  userData: userInformation;
  location: string;
  phoneNumber: string;
};

interface PostDetailHeaderProps {
  headerData: HeaderData;
}

const PublicDetailHeader = ({ headerData }: PostDetailHeaderProps) => {
  const t = useTranslations("PublicDetailHeader");
  const { imageResponseList, userData, location, phoneNumber } = headerData;

  const [isNumberCheck, setIsNumberCheck] = useState(false);

  return (
    <>
      <ImageSection imageUrls={imageResponseList} />

      <section
        aria-label={t("authorInfoAriaLabel")}
        className={cn(
          "flex flex-col items-start justify-center gap-5 border-b border-divider-default p-5",
          "tablet:flex-row tablet:items-center tablet:justify-between"
        )}
      >
        <div className={cn("flex items-center justify-start gap-[14px]", "tablet:w-[461px]")}>
          <Image
            width={40}
            height={40}
            src="/public-data/public-data-detail-avatar.webp"
            alt={userData.nickName}
            priority={true}
            unoptimized
            draggable={false}
            className="select-none rounded-full"
          />

          <div className="flex flex-col items-start justify-center">
            <p className="text-body1-medium text-layout-header-default">{userData.nickName}</p>
            <div className="text-body2-regular text-layout-body-default">
              <span className="text-body2-regular text-layout-body-default">
                {t("policeLabel")}
              </span>
            </div>
          </div>
        </div>

        {phoneNumber && (
          <Button
            className={cn("min-h-11 w-full py-[10px]", "tablet:flex-1")}
            onClick={() => setIsNumberCheck(true)}
          >
            {t("contactButton")}
          </Button>
        )}
      </section>

      {phoneNumber && (
        <PublicCallBottomSheet
          callBottomSheetData={{ location, phoneNumber }}
          isOpen={isNumberCheck}
          onClose={() => setIsNumberCheck(false)}
        />
      )}
    </>
  );
};

export default PublicDetailHeader;
