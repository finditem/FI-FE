"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Chip, ListItemImage } from "@/components";
import { PublicDataItem } from "@/types";
import { cn, formatDate } from "@/utils";

interface PublicDataItemCardProps {
  item: PublicDataItem;
}

const NO_IMAGE_URL = "https://minwon24.police.go.kr/images/sub/img02_no_img.gif";

const PublicDataItemCard = ({ item }: PublicDataItemCardProps) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "lost";
  const postId = item.atcId;

  const imageSrc =
    item.fdFilePathImg && item.fdFilePathImg !== NO_IMAGE_URL ? item.fdFilePathImg : null;

  return (
    <li>
      <Link
        href={`/public-data/${type}/${postId}`}
        aria-label={item.fdPrdtNm || item.fdSbjt}
        className={cn(
          "flex w-full items-center gap-[14px] px-5 py-[30px]",
          "border-b border-b-flatGray-50"
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex gap-2">
            <Chip label="경찰청" type="brandSubtle" />
            <Chip label={item.prdtClNm} type="neutralStrong" />
          </div>

          <div className="w-full">
            <div className="flex items-center gap-1">
              <h2 className="flex-1 text-h3-semibold text-layout-header-default u-ellipsis">
                {item.fdPrdtNm || item.fdSbjt}
              </h2>
            </div>
            <span className="text-body2-regular text-layout-body-default">
              <span className="after:inline-block after:px-1 after:content-['·']">
                {item.depPlace}
              </span>
              <time dateTime={item.fdYmd}>{formatDate(item.fdYmd)}</time>
            </span>
          </div>
        </div>

        <ListItemImage src={imageSrc} alt="게시글 대표 이미지" size={90} />
      </Link>
    </li>
  );
};

export default PublicDataItemCard;
