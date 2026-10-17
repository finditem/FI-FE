"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Chip, KebabMenuButton, ProfileAvatar } from "@/components";
import useFormatDate from "@/hooks/useFormatDate/useFormatDate";
import { useClickOutside } from "@/hooks";
import type { ReviewCardData } from "../../../_types/ReviewCardData";

interface ReviewCardProps {
  data: ReviewCardData;
}

/**
 * 찾길 후기 카드 하나를 렌더합니다.
 *
 * @remarks
 * - 케밥 메뉴를 열면 후기 숨기기 버튼을 표시합니다.
 * - 실제 후기 숨기기 처리는 API 연동 전입니다.
 */
const ReviewCard = ({ data }: ReviewCardProps) => {
  const t = useTranslations("ReviewCard");
  const formatDate = useFormatDate();
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const kebabMenuRef = useClickOutside(() => setIsKebabMenuOpen(false));
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
            <div ref={kebabMenuRef} className="relative">
              <KebabMenuButton
                ariaLabel={t(isKebabMenuOpen ? "menuCloseAriaLabel" : "menuOpenAriaLabel")}
                aria-expanded={isKebabMenuOpen}
                size="small"
                onClick={() => setIsKebabMenuOpen((prev) => !prev)}
              />

              {isKebabMenuOpen && (
                <Button
                  ignoreBase
                  icon={{ name: "Eye", size: 24 }}
                  className="glass-card absolute right-0 top-full z-10 mt-1 flex items-center gap-2 text-nowrap rounded-[20px] border border-white px-7 py-[15px] text-h3-medium text-system-warning bg-fill-neutral-subtle-default"
                >
                  {t("hideReview")}
                </Button>
              )}
            </div>
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
