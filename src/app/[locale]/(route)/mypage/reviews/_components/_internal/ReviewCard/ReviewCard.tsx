"use client";

import { useTranslations } from "next-intl";
import { Chip, KebabMenuButton, ProfileAvatar } from "@/components";
import useFormatDate from "@/hooks/useFormatDate/useFormatDate";
import type { ReviewCardData } from "../../../_types/ReviewCardData";

interface ReviewCardProps {
  data: ReviewCardData;
}

/**
 * 찾길 후기 카드 하나를 렌더합니다.
 *
 * @remarks
 * - 케밥 메뉴 버튼은 현재 동작이 연결되어 있지 않습니다(퍼블리싱 범위).
 */
const ReviewCard = ({ data }: ReviewCardProps) => {
  const t = useTranslations("ReviewCard");
  const formatDate = useFormatDate();
  const { avatarUrl, nickname, location, createdAt, content, tagLabel, extraTagCount } = data;

  return (
    <li className="w-full px-5 py-[30px]">
      <div className="flex items-center gap-2">
        <ProfileAvatar src={avatarUrl} alt={nickname} size={60} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <p className="flex-1 truncate text-body1-semibold text-layout-header-default">
              {nickname}
            </p>
            {/* TODO(수현): 케밥 메뉴 동작(신고/숨기기 등) 연동 */}
            <KebabMenuButton ariaLabel={t("menuAriaLabel")} size="small" />
          </div>
          <p className="text-body2-regular text-layout-body-default">
            <span className="after:inline-block after:px-1 after:content-['·']">{location}</span>
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-body2-medium text-neutral-normal-default">{content}</p>

      <div className="mt-3 flex items-center gap-1">
        <Chip label={tagLabel} type="neutralStrong" />
        {!!extraTagCount && <Chip label={`+${extraTagCount}`} type="brandSubtle" />}
      </div>
    </li>
  );
};

export default ReviewCard;
