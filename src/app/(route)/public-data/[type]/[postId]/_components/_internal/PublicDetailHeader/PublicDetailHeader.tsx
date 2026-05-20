"use client";

import { useState } from "react";
import { Button, ProfileAvatar } from "@/components/common";
import { cn } from "@/utils";
import { ImageResponse, userInformation } from "@/api/fetch/post";
import ImageSection from "@/app/(route)/list/[id]/_components/_internal/ImageSection/ImageSection";
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
  const { imageResponseList, userData, location, phoneNumber } = headerData;

  const [isNumberCheck, setIsNumberCheck] = useState(false);

  return (
    <>
      <ImageSection imageUrls={imageResponseList} />

      <section
        aria-label="게시글 작성자 정보"
        className={cn(
          "flex flex-col items-start justify-center gap-5 border-b border-divider-default p-5",
          "tablet:flex-row tablet:items-center tablet:justify-between"
        )}
      >
        <div className={cn("flex items-center justify-start gap-[14px]", "tablet:w-[461px]")}>
          <Image
            width={40}
            height={40}
            src={"/public-data/public-data-detail-avatar.png"}
            alt={userData.nickName}
            priority={true}
            draggable={false}
            className="select-none rounded-full"
          />

          <div className="flex flex-col items-start justify-center">
            <p className="text-body1-medium text-layout-header-default">{userData.nickName}</p>
            <div className="text-body2-regular text-layout-body-default">
              <span className="text-body2-regular text-layout-body-default">경찰청</span>
            </div>
          </div>
        </div>

        {phoneNumber && (
          <Button
            className={cn("min-h-11 w-full py-[10px]", "tablet:flex-1")}
            onClick={() => setIsNumberCheck(true)}
          >
            연락처 확인하기
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
